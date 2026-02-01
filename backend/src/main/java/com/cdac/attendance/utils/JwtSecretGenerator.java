package com.cdac.attendance.utils;

import java.security.SecureRandom;
import java.util.Base64;

public class JwtSecretGenerator {
    public static void main(String[] args) {
        byte[] keyBytes = new byte[64]; // 512 bits for HS512
        new SecureRandom().nextBytes(keyBytes);
        String secret = Base64.getEncoder().withoutPadding().encodeToString(keyBytes);
        
        System.out.println("COPY THIS TO application.properties:");
        System.out.println(secret);
    }
}