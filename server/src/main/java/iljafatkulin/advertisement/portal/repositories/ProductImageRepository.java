package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    @Transactional
    @Modifying
    @Query("UPDATE ProductImage pi SET pi.path = :path WHERE pi.id IN :ids")
    void updatePathsByIds(@Param("ids") int[] ids, @Param("path") String[] paths);

    @Query("UPDATE ProductImage pi SET pi.path = :path WHERE pi.id IN :id")
    void updatePathById(@Param("id") int id, @Param("path") String path);
}
