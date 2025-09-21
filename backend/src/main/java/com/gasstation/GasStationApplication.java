package com.gasstation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GasStationApplication {

    public static void main(String[] args) {
        SpringApplication.run(GasStationApplication.class, args);
    }
} 