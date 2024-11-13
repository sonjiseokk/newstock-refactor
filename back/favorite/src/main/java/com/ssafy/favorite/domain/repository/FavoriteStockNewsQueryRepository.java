package com.ssafy.favorite.domain.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.favorite.domain.entity.FavoriteStockNews;
import com.ssafy.favorite.domain.entity.QFavoriteStockNews;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.ssafy.favorite.domain.entity.QFavoriteStockNews.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class FavoriteStockNewsQueryRepository {
    private final JPAQueryFactory queryFactory;

    /**
     * 한 멤버가 좋아요한 모든 스톡 뉴스를 페이징 처리하여 반환해주는 쿼리
     * @param memberId
     * @param pageable
     * @return
     */
    public Page<FavoriteStockNews> findAllFavoriteNewsByMemberId(Long memberId, Pageable pageable) {
        List<FavoriteStockNews> content = queryFactory.selectFrom(favoriteStockNews)
                .where(favoriteStockNews.memberId.eq(memberId))
                .orderBy(favoriteStockNews.createdDate.desc())
                .offset(Math.max(pageable.getOffset(), 0))
                .limit(pageable.getPageSize())
                .fetch();

        long total = Optional.ofNullable(
                queryFactory.select(favoriteStockNews.count())
                        .from(favoriteStockNews)
                        .where(favoriteStockNews.memberId.eq(memberId))
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(content, pageable, total);
    }
}
