package com.ssafy.stock.global.util;

import com.ssafy.stock.global.common.MemberIdRequest;
import com.ssafy.stock.global.common.MemberIdResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "authClient", url = "http://newstock.info/api/auth")
public interface AuthFeignClient {
    @PostMapping("/token-info")
    ResponseEntity<MemberIdResponse> getMemberId(@RequestBody MemberIdRequest memberIdRequest);
}