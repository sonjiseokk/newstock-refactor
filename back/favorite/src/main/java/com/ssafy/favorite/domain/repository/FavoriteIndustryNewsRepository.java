package com.ssafy.favorite.domain.repository;

import com.ssafy.favorite.domain.entity.FavoriteIndustryNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteIndustryNewsRepository extends JpaRepository<FavoriteIndustryNews, Long> {
    boolean existsByMemberIdAndIndustryNewsId(Long memberId, String industryNewsId);

    void deleteByMemberIdAndIndustryNewsId(Long memberId, String industryNewsId);
}
