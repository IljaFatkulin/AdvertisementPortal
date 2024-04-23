package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    Optional<Favorite> findByProductIdAndAccountId(int productId, long accountId);

    List<Favorite> findByAccountId(long accountId);
}
