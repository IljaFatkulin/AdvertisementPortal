package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.ProductView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductViewRepository extends JpaRepository<ProductView, Long> {
    long countByProductId(long productId);

    long countByProductIdAndAuthorized(long productId, boolean authorized);

    boolean existsByUserIdAndProductId(String userId, long productId);

    Long countByProductIdIn(List<Integer> productIds);
    Long countByProductIdInAndAuthorized(List<Integer> productIds, boolean authorized);

    Long countByProductIdInAndCreatedAtAfter(List<Integer> productIds, Date date);
    Long countByProductIdInAndCreatedAtAfterAndAuthorized(List<Integer> productIds, Date date, boolean authorized);
}