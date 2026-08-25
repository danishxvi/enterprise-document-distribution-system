package com.edds.config;

import com.edds.branch.Branch;
import com.edds.branch.BranchRepository;
import com.edds.user.Role;
import com.edds.user.User;
import com.edds.user.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds the reference data the portal needs to be usable on a fresh database:
 * the branch master list and one account per role. It only writes when a table
 * is empty, so restarts never duplicate rows and existing data is left alone.
 *
 * The demo passwords are deliberately simple for evaluation. Change them, or
 * disable this seeder, before any real deployment.
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(
        BranchRepository branches,
        UserRepository users,
        PasswordEncoder encoder
    ) {
        return args -> {
            if (branches.count() == 0) {
                branches.saveAll(List.of(
                    new Branch("Operations", "OPS"),
                    new Branch("Human Resources", "HR"),
                    new Branch("Engineering", "ENG"),
                    new Branch("Finance", "FIN"),
                    new Branch("Rolling Stock", "RS"),
                    new Branch("Signalling and Telecom", "SNT")
                ));
            }

            if (users.count() == 0) {
                users.saveAll(List.of(
                    new User(
                        "Admin User",
                        "admin@edds.local",
                        encoder.encode("admin123"),
                        Role.ADMIN
                    ),
                    new User(
                        "Employee User",
                        "employee@edds.local",
                        encoder.encode("employee123"),
                        Role.EMPLOYEE
                    )
                ));
            }
        };
    }
}
