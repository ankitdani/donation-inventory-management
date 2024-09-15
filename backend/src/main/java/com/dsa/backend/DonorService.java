package com.dsa.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    public Donor createDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Optional<Donor> getDonorById(String id) {
        return donorRepository.findById(id);
    }

    public Donor updateDonor(String id, Donor donor) {
        if (donorRepository.existsById(id)) {
            donor.setId(id);
            return donorRepository.save(donor);
        }
        return null;
    }

    public void deleteDonor(String id) {
        donorRepository.deleteById(id);
    }
}
