package com.gasstation.config;

import com.gasstation.entity.*;
import com.gasstation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@Profile("h2")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private LotteryGameRepository lotteryGameRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeUsers();
            initializeCategories();
            initializeProducts();
            initializeLotteryGames();
            // Sample transactions can be created through the frontend POS interface
            initializeSampleTransactions();
        }
    }
    
    private void initializeUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setEmail("admin@gasstation.com");
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setPhone("555-0100");
        admin.setActive(true);
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(Role.ADMIN);
        adminRoles.add(Role.MANAGER);
        adminRoles.add(Role.CASHIER);
        admin.setRoles(adminRoles);
        userRepository.save(admin);
        
        // Create manager user
        User manager = new User();
        manager.setUsername("manager1");
        manager.setPassword(passwordEncoder.encode("password123"));
        manager.setEmail("manager@gasstation.com");
        manager.setFirstName("John");
        manager.setLastName("Manager");
        manager.setPhone("555-0101");
        manager.setActive(true);
        Set<Role> managerRoles = new HashSet<>();
        managerRoles.add(Role.MANAGER);
        managerRoles.add(Role.CASHIER);
        manager.setRoles(managerRoles);
        userRepository.save(manager);
        
        // Create cashier user
        User cashier = new User();
        cashier.setUsername("cashier1");
        cashier.setPassword(passwordEncoder.encode("password123"));
        cashier.setEmail("cashier@gasstation.com");
        cashier.setFirstName("Jane");
        cashier.setLastName("Cashier");
        cashier.setPhone("555-0102");
        cashier.setActive(true);
        Set<Role> cashierRoles = new HashSet<>();
        cashierRoles.add(Role.CASHIER);
        cashier.setRoles(cashierRoles);
        userRepository.save(cashier);
        
        System.out.println("Sample users created successfully!");
    }

    private void initializeCategories() {
        List<Object[]> categoriesData = Arrays.asList(
            new Object[]{"Beverages", "Soft drinks, energy drinks, water", BigDecimal.valueOf(8.25)},
            new Object[]{"Snacks", "Chips, candy, nuts", BigDecimal.valueOf(8.25)},
            new Object[]{"Tobacco", "Cigarettes, cigars, vapes", BigDecimal.valueOf(15.50)},
            new Object[]{"Automotive", "Motor oil, windshield fluid, accessories", BigDecimal.valueOf(7.50)},
            new Object[]{"Food", "Hot food, sandwiches, prepared meals", BigDecimal.valueOf(6.00)}
        );
        
        for (Object[] data : categoriesData) {
            Category category = new Category();
            category.setName((String) data[0]);
            category.setDescription((String) data[1]);
            category.setTaxRate((BigDecimal) data[2]);
            category.setActive(true);
            categoryRepository.save(category);
        }
        
        System.out.println("Sample categories created successfully!");
    }

    private void initializeProducts() {
        List<Category> categories = categoryRepository.findAll();
        Category beverages = categories.stream().filter(c -> c.getName().equals("Beverages")).findFirst().orElse(null);
        Category snacks = categories.stream().filter(c -> c.getName().equals("Snacks")).findFirst().orElse(null);
        Category tobacco = categories.stream().filter(c -> c.getName().equals("Tobacco")).findFirst().orElse(null);
        Category food = categories.stream().filter(c -> c.getName().equals("Food")).findFirst().orElse(null);
        
        // Beverages - Some are food stamp eligible (soft drinks, water), energy drinks are not
        createProduct("Coca Cola 20oz", "123456789012", beverages, 1.89, 1.25, 50, 10, true, true);
        createProduct("Pepsi 20oz", "123456789013", beverages, 1.89, 1.25, 45, 10, true, true);
        createProduct("Red Bull 8.4oz", "123456789014", beverages, 3.99, 2.50, 4, 5, true, false); // Energy drinks not eligible
        createProduct("Water Bottle 16.9oz", "123456789015", beverages, 1.29, 0.75, 100, 20, true, true);
        createProduct("Monster Energy", "123456789016", beverages, 3.49, 2.25, 0, 8, true, false); // Energy drinks not eligible
        
        // Snacks - Most are food stamp eligible
        createProduct("Lay's Classic Chips", "234567890123", snacks, 2.49, 1.50, 30, 5, true, true);
        createProduct("Snickers Bar", "234567890124", snacks, 1.79, 1.00, 48, 10, true, true);
        createProduct("M&M's Peanut", "234567890125", snacks, 1.99, 1.25, 36, 8, true, true);
        createProduct("Doritos Nacho Cheese", "234567890126", snacks, 2.79, 1.75, 3, 5, true, true);
        
        // Tobacco - Never food stamp eligible
        createProduct("Marlboro Red Pack", "345678901234", tobacco, 8.99, 7.50, 100, 20, true, false);
        createProduct("Newport Menthol", "345678901235", tobacco, 8.99, 7.50, 95, 20, true, false);
        
        // Add some food items
        if (food != null) {
            createProduct("Bread Loaf", "456789012345", food, 2.99, 1.50, 25, 5, true, true);
            createProduct("Milk Gallon", "456789012346", food, 3.49, 2.25, 20, 3, true, true);
            createProduct("Hot Dog (Prepared)", "456789012347", food, 1.99, 0.75, 50, 10, true, false); // Prepared hot food not eligible
        }
        
        System.out.println("Sample products created successfully!");
    }

    private void createProduct(String name, String barcode, Category category, double price, double cost, int stock, int reorderThreshold, boolean active, boolean foodStampEligible) {
        Product product = new Product();
        product.setName(name);
        product.setBarcode(barcode);
        product.setCategory(category);
        product.setPrice(BigDecimal.valueOf(price));
        product.setCost(BigDecimal.valueOf(cost));
        product.setCurrentStock(stock);
        product.setReorderThreshold(reorderThreshold);
        product.setActive(active);
        product.setFoodStampEligible(foodStampEligible);
        product.setDescription(name + " - Premium quality product");
        productRepository.save(product);
    }
    
    private void initializeLotteryGames() {
        // Scratch-off tickets
        LotteryGame game1 = new LotteryGame();
        game1.setName("Lucky 7s");
        game1.setBarcode("777777777777");
        game1.setTicketPrice(BigDecimal.valueOf(1.00));
        game1.setPackCost(BigDecimal.valueOf(180.00));
        game1.setPackCount(300);
        game1.setCurrentStock(275);
        game1.setActive(true);
        lotteryGameRepository.save(game1);
        
        LotteryGame game2 = new LotteryGame();
        game2.setName("Cash Explosion");
        game2.setBarcode("888888888888");
        game2.setTicketPrice(BigDecimal.valueOf(5.00));
        game2.setPackCost(BigDecimal.valueOf(600.00));
        game2.setPackCount(150);
        game2.setCurrentStock(142);
        game2.setActive(true);
        lotteryGameRepository.save(game2);
        
        LotteryGame game3 = new LotteryGame();
        game3.setName("Diamond Millions");
        game3.setBarcode("999999999999");
        game3.setTicketPrice(BigDecimal.valueOf(10.00));
        game3.setPackCost(BigDecimal.valueOf(1500.00));
        game3.setPackCount(200);
        game3.setCurrentStock(0); // Out of stock
        game3.setActive(true);
        lotteryGameRepository.save(game3);
        
        System.out.println("Sample lottery games created successfully!");
    }

    private void initializeSampleTransactions() {
        try {
            // Get sample user and products
            User cashier = userRepository.findByUsername("cashier1").orElse(null);
            if (cashier == null) {
                cashier = userRepository.findByUsername("admin").orElse(null);
                if (cashier == null) {
                    System.out.println("No users found, skipping sample transactions");
                    return;
                }
            }

            List<Product> products = productRepository.findAll();
            if (products.isEmpty()) {
                System.out.println("No products found, skipping sample transactions");
                return;
            }

            // Create sample transactions with proper structure
            createSampleTransaction(cashier, "TXN-001", PaymentMethod.CREDIT_CARD, 
                BigDecimal.valueOf(4.38), BigDecimal.valueOf(0.36), BigDecimal.valueOf(4.74));
            
            createSampleTransaction(cashier, "TXN-002", PaymentMethod.EBT, 
                BigDecimal.valueOf(6.48), BigDecimal.ZERO, BigDecimal.valueOf(6.48));
            
            createSampleTransaction(cashier, "TXN-003", PaymentMethod.CASH, 
                BigDecimal.valueOf(8.99), BigDecimal.valueOf(1.39), BigDecimal.valueOf(10.38));
            
            createSampleTransaction(cashier, "TXN-004", PaymentMethod.DEBIT_CARD, 
                BigDecimal.valueOf(5.78), BigDecimal.valueOf(0.48), BigDecimal.valueOf(6.26));

            System.out.println("Sample transactions created successfully!");
        } catch (Exception e) {
            System.out.println("Error creating sample transactions: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createSampleTransaction(User cashier, String transactionNumber, PaymentMethod paymentMethod, 
                                       BigDecimal subtotal, BigDecimal tax, BigDecimal total) {
        try {
            Transaction transaction = new Transaction();
            transaction.setTransactionNumber(transactionNumber);
            transaction.setCashier(cashier);
            transaction.setPaymentMethod(paymentMethod);
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setTransactionDate(LocalDateTime.now().minusHours((long)(Math.random() * 48)));
            
            transaction.setSubtotal(subtotal);
            transaction.setTaxAmount(tax);
            transaction.setTotalAmount(total);
            transaction.setDiscountAmount(BigDecimal.ZERO);

            // Save transaction
            transaction = transactionRepository.save(transaction);

            System.out.println("Created sample transaction: " + transactionNumber + " - $" + total);
        } catch (Exception e) {
            System.out.println("Error creating transaction " + transactionNumber + ": " + e.getMessage());
        }
    }
} 