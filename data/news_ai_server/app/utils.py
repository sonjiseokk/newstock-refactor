import os
import logging
import pymysql
from pymysql.cursors import DictCursor
import pandas as pd
from dotenv import load_dotenv
from exception import StockInfoEmptyException

# .env파일 로드
load_dotenv(os.path.join('core', '.env'))

# 로깅 설정
logging.basicConfig(level=logging.INFO,
                    format='%(levelname)s:  %(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

# MySQL DB Connection
def connect_db() -> pymysql.connections.Connection:
    """MySQL 데이터베이스에 연결합니다.

    Returns:
        pymysql.connections.Connection: MySQL 데이터베이스 연결 객체.
    """
    connection = pymysql.connect(
        host=os.getenv('MYSQL_DB_HOST'),      # 데이터베이스 호스트
        port=int(os.getenv('MYSQL_DB_PORT')),  # 데이터베이스 포트
        user=os.getenv('MYSQL_DB_USER'),      # 사용자 이름
        password=os.getenv('MYSQL_DB_PASSWORD'),  # 비밀번호
        db=os.getenv('MYSQL_DB_NAME'),        # 연결할 데이터베이스 이름
        charset=os.getenv('MYSQL_DB_CHARSET'), # 문자 인코딩
        cursorclass=DictCursor           # 반환할 커서 클래스
    )
    
    return connection

def get_stock_data(stock_code: str, start_date=None, end_date=None) -> pd.DataFrame:
    """
    특정 주식 코드와 날짜 범위에 대한 주가 데이터를 가져옵니다.

    Args:
        stock_code (str): 데이터를 가져올 주식 코드.
        start_date (str, optional): 조회할 시작 날짜 (형식: 'YYYY-MM-DD'). 기본값은 None.
        end_date (str, optional): 조회할 종료 날짜 (형식: 'YYYY-MM-DD'). 기본값은 None.
    
    Returns:
        pd.DataFrame: 주식 코드, 주가 날짜, 종가(Close), 고가(High), 저가(Low), 시가(Open)를 포함하는 데이터프레임.
    """
    connection = connect_db()
    try:
        cursor = connection.cursor()

        # 주식 데이터와 주식 캔들 데이터를 조인하여 데이터를 가져오는 SQL 쿼리
        query = """
            SELECT s.stock_code, 
                   sc.stock_candle_day, sc.stock_candle_close AS Close, sc.stock_candle_high AS High, sc.stock_candle_low AS Low, sc.stock_candle_open AS Open
            FROM stocks AS s 
            LEFT JOIN stocks_candle AS sc ON s.stock_id = sc.stock_id 
            WHERE s.stock_code = %s
        """

        # start_date와 end_date가 있을 경우, 날짜 필터를 쿼리에 추가
        if start_date and end_date:
            query += " AND sc.stock_candle_day BETWEEN %s AND %s;"
            # stock_code, start_date, end_date를 인자로 설정
            params = [stock_code, start_date, end_date]
        else:
            # stock_code만 인자로 설정
            params = [stock_code]
        
        # 쿼리 실행
        cursor.execute(query, params)

        # 결과를 pandas DataFrame으로 반환
        df = pd.DataFrame(cursor.fetchall(), columns=['stock_code', 
                                                       'stock_candle_day', 'Close', 'High', 'Low', 'Open'])

        # 빈 데이터프레임 체크
        if df.empty:
            raise StockInfoEmptyException(stock_code, start_date, end_date)

        return df
    
    except Exception as e:
        logger.error(e)
        # 예외 발생 시 StockInfoEmptyException을 다시 던지도록 수정
        if isinstance(e, StockInfoEmptyException):
            raise e  # 예외를 재발생시킴
        else:
            raise  # 다른 예외는 다시 발생시킴

    finally:
        # 커서와 연결을 항상 닫음
        cursor.close()
        connection.close()

def get_all_stock_data_for_industry(base_stock_code: str) -> pd.DataFrame:
    """특정 산업군에 속하는 모든 주식 데이터를 가져옵니다.

    Args:
        base_stock_code (str): 기준이 되는 주식 코드.

    Returns:
        pd.DataFrame: 특정 산업군에 대한 주식 코드 및 관련 데이터가 포함된 DataFrame.
    """
    connection = connect_db()
    try:
        with connection.cursor() as cursor:
            # 기준 주식 코드와 같은 산업에 속하는 다른 주식 코드들을 가져옴
            query = """
                SELECT stock_code 
                FROM stocks 
                WHERE stock_industry = (
                    SELECT stock_industry 
                    FROM stocks 
                    WHERE stock_code = %s
                );
            """

            # 기준 주식 코드를 사용하여 쿼리 실행
            cursor.execute(query, (base_stock_code,))
            stock_codes = [row['stock_code'] for row in cursor.fetchall()]

            # 주식 코드가 존재하는 경우 전체 기간의 데이터를 가져오는 쿼리
            if stock_codes:
                stock_codes_placeholder = ', '.join(['%s'] * len(stock_codes))
                data_query = f"""
                    SELECT s.stock_code, s.stock_name, 
                           sc.stock_candle_day, sc.stock_candle_close AS Close, 
                           sc.stock_candle_high AS High, sc.stock_candle_low AS Low, 
                           sc.stock_candle_open AS Open
                    FROM stocks AS s 
                    LEFT JOIN stocks_candle AS sc ON s.stock_id = sc.stock_id 
                    WHERE s.stock_code IN ({stock_codes_placeholder})
                """
                
                cursor.execute(data_query, stock_codes)
                # 결과를 DataFrame으로 반환
                result = pd.DataFrame(cursor.fetchall(), columns=['stock_code', 'stock_name', 
                                                                  'stock_candle_day', 'Close', 'High', 'Low', 'Open'])
            else:
                # 주식 코드가 없는 경우 빈 DataFrame 반환
                result = pd.DataFrame(columns=['stock_code', 'stock_name', 
                                                'stock_candle_day', 'Close', 'High', 'Low', 'Open'])
        return result
    finally:
        connection.close()