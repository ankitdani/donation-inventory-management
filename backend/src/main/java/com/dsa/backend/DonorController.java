package com.dsa.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonorController {

    @Autowired
    private DonorService donorService;

    @PostMapping
    public ResponseEntity<Donor> createDonor(@RequestBody Donor donor) {
        if (donor.getDateOfDonation() == null) {
            donor.setDateOfDonation(new Date()); // Set current date if not provided
        }
        Donor createdDonor = donorService.createDonor(donor);
        return new ResponseEntity<>(createdDonor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Donor>> getAllDonors() {
        List<Donor> donors = donorService.getAllDonors();
        return new ResponseEntity<>(donors, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(@PathVariable String id) {
        Optional<Donor> donor = donorService.getDonorById(id);
        return donor.map(d -> new ResponseEntity<>(d, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(@PathVariable String id, @RequestBody Donor donor) {
        Donor updatedDonor = donorService.updateDonor(id, donor);
        if (updatedDonor != null) {
            return new ResponseEntity<>(updatedDonor, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable String id) {
        donorService.deleteDonor(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
