package com.gasstation.controller;

import com.gasstation.entity.LotteryGame;
import com.gasstation.repository.LotteryGameRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lottery")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LotteryController {

    @Autowired
    private LotteryGameRepository lotteryGameRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public List<LotteryGame> getAllLotteryGames() {
        return lotteryGameRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<LotteryGame> getLotteryGameById(@PathVariable Long id) {
        Optional<LotteryGame> game = lotteryGameRepository.findById(id);
        return game.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/barcode/{barcode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<LotteryGame> getLotteryGameByBarcode(@PathVariable String barcode) {
        Optional<LotteryGame> game = lotteryGameRepository.findByBarcode(barcode);
        return game.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public LotteryGame createLotteryGame(@Valid @RequestBody LotteryGame game) {
        return lotteryGameRepository.save(game);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LotteryGame> updateLotteryGame(@PathVariable Long id, @Valid @RequestBody LotteryGame gameDetails) {
        Optional<LotteryGame> gameOptional = lotteryGameRepository.findById(id);
        
        if (gameOptional.isPresent()) {
            LotteryGame game = gameOptional.get();
            game.setName(gameDetails.getName());
            game.setBarcode(gameDetails.getBarcode());
            game.setTicketPrice(gameDetails.getTicketPrice());
            game.setPackCount(gameDetails.getPackCount());
            game.setCurrentStock(gameDetails.getCurrentStock());
            game.setActive(gameDetails.getActive());
            return ResponseEntity.ok(lotteryGameRepository.save(game));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteLotteryGame(@PathVariable Long id) {
        if (lotteryGameRepository.existsById(id)) {
            lotteryGameRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/sell/{quantity}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<LotteryGame> sellTickets(@PathVariable Long id, @PathVariable Integer quantity) {
        Optional<LotteryGame> gameOptional = lotteryGameRepository.findById(id);
        
        if (gameOptional.isPresent()) {
            LotteryGame game = gameOptional.get();
            if (game.getCurrentStock() < quantity) {
                return ResponseEntity.badRequest().build(); // Not enough stock
            }
            game.setCurrentStock(game.getCurrentStock() - quantity);
            return ResponseEntity.ok(lotteryGameRepository.save(game));
        }
        
        return ResponseEntity.notFound().build();
    }
} 