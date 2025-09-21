package com.gasstation.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;

@Component
public class JwtUtils {

    @Value("${app.security.jwt.expiration:86400}")
    private int jwtExpirationMs;

    @Value("${spring.security.jwt.secret:mySecretKey123456789012345678901234567890}")
    private String jwtSecret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(UserPrincipal userPrincipal) {
        return generateTokenFromUsername(userPrincipal.getUsername(), userPrincipal.getRoleNames());
    }

    public String generateTokenFromUsername(String username, Set<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Claims getClaimsFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException e) {
            System.err.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
} 