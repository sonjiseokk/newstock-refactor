package com.ssafy.news.domain.repository;

import com.ssafy.news.domain.entity.stock.StockKeyword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockKeywordRepository extends JpaRepository<StockKeyword, Long> {
}