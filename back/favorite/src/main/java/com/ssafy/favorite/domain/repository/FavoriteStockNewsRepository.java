package com.ssafy.favorite.domain.repository;

import com.ssafy.favorite.domain.entity.FavoriteStockNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteStockNewsRepository extends JpaRepository<FavoriteStockNews, Long> {
    boolean existsByMemberIdAndStockNewsId(Long memberId, String stockNewsId);

    void deleteByMemberIdAndStockNewsId(Long memberId, String stockNewsId);
}
