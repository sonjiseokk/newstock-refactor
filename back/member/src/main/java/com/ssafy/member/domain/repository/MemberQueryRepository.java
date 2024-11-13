package com.ssafy.member.domain.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.member.domain.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy.member.domain.entity.QMember.*;

@Slf4j
@Repository
@RequiredArgsConstructor
public class MemberQueryRepository {
    private final JPAQueryFactory query;

    /**
     * 회원의 보유중인 주식의 상승률 순위 랭킹을 조회하는 쿼리
     * (랭킹 개념이 멤버에게 종속 되는 것이 조금 그래서 리팩터링 필요)
     *
     * @return
     */
    public List<Member> getHoldingRank() {
        return query.select(member)
                .from(member)
                .where(member.holdingChangeRate.isNotNull())
                .orderBy(member.holdingChangeRate.desc())
                .limit(10)
                .fetch();
    }

    /**
     * 멤버의 거래내역으로 수익률을 계산
     * (이것도 리팩터링 필요, 데이터 정합성 문제)
     * @return
     */
    public List<Member> getTransactionRank(){
        return query.select(member)
                .from(member)
                .where(member.transactionChangeRate.isNotNull())
                .orderBy(member.transactionChangeRate.desc())
                .limit(10)
                .fetch();
    }


}
