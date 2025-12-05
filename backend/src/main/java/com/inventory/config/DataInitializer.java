package com.inventory.config;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                productRepository.save(new Product(
                        "Dell Inspiron Laptop", "Electronics",
                        48000.0, 55000.0, 8
                ));
                productRepository.save(new Product(
                        "Samsung Galaxy A55", "Mobile",
                        25000.0, 28999.0, 15
                ));
                productRepository.save(new Product(
                        "Office Chair (Ergonomic)", "Furniture",
                        3000.0, 4200.0, 12
                ));
                productRepository.save(new Product(
                        "HP Laser Printer", "Electronics",
                        9000.0, 11500.0, 5
                ));
            }
        };
    }
}
