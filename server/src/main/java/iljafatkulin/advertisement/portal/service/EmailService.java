package iljafatkulin.advertisement.portal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendMessage(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("adsmarketplace@outlook.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    public void sendWelcomeMessage(String to) {
        String userFirstName = "User";
        String supportEmail = "adsmarketplace@outlook.com";

        String emailSubject = "Welcome to Ads Marketplace!";
        String emailMessage = "Dear " + userFirstName + ",\n\n" +
                "Congratulations and a warm welcome to Ads Marketplace! We are thrilled to have you as part of our community.\n\n" +
                "Your account has been successfully created. As a registered member, you now have access to a wide range of features and opportunities to engage with our vibrant marketplace:\n\n" +
                "1. Post Your Ads: Start listing your items or services with ease.\n" +
//                "2. Personalized Dashboard: Manage your ads, track views, and edit your listings anytime.\n" +
                "2. Advanced Search: Find exactly what you’re looking for with our advanced search options.\n" +
//                "4. Favorites: Save ads you’re interested in for quick access later.\n" +
                "3. User Safety: We prioritize your safety with secure transactions and privacy controls.\n\n" +
                "Getting Started:\n\n" +
//                "- Complete Your Profile: Add a profile picture and a short bio to increase trust among other users.\n" +
                "- Explore Categories: Browse through our diverse categories to find what interests you.\n" +
                "- Post Your First Ad: It’s quick and easy! Just click on the 'Post Ad' button and follow the simple steps.\n\n" +
                "Need Help? Our dedicated support team is here for you. If you have any questions or need assistance, please don’t hesitate to reach out at " + supportEmail + ".\n\n" +
//                "Stay Connected: Don’t miss out on updates, tips, and special offers! Follow us on [Social Media Links].\n\n" +
                "Once again, welcome to Ads Marketplace! We are excited to see what you will discover and share with our community.\n\n" +
                "Best Regards,\n" +
                "Ads Marketplace, Support Team";

        this.sendMessage(to, emailSubject, emailMessage);
    }

    public void sendCodeToChangePassword(String to, String code) {
        String emailSubject = "Password Reset Request";
        String emailMessage = "Dear User,\n\n" +
                "We have received a request to reset your password. To proceed, please use the following verification code:\n\n" +
                "Verification Code: " + code + "\n\n" +
                "If you did not request a password reset, you can ignore this email. Your account's security is our top priority.\n\n" +
                "Best Regards,\n" +
                "Ads Marketplace, Support Team";

        sendMessage(to, emailSubject, emailMessage);
    }
}
