package com.ssafy.favorite.domain.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.favorite.domain.entity.FavoriteIndustryNews;
import com.ssafy.favorite.domain.entity.FavoriteStockNews;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.ssafy.favorite.domain.entity.QFavoriteIndustryNews.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class FavoriteIndustryNewsQueryRepository {
    private final JPAQueryFactory queryFactory;

    /**
     * 한 멤버가 좋아요한 모든 시황 뉴스를 페이징 처리하여 반환해주는 쿼리
     *
     * @param memberId
     * @param pageable
     * @return
     */
    public Page<FavoriteIndustryNews> findAllFavoriteNewsByMemberId(Long memberId, Pageable pageable) {
        List<FavoriteIndustryNews> content = queryFactory.selectFrom(favoriteIndustryNews)
                .where(favoriteIndustryNews.memberId.eq(memberId))
                .orderBy(favoriteIndustryNews.createdDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = Optional.ofNullable(
                queryFactory.select(favoriteIndustryNews.count())
                        .from(favoriteIndustryNews)
                        .where(favoriteIndustryNews.memberId.eq(memberId))
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(content, pageable, total);
    }
}
