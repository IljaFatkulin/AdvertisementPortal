package iljafatkulin.advertisement.portal.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ProfileStatsDTO {
    private Long viewCount;
    private Integer activeAds;
    private Long authViewCount;

    private Long viewCountLastMonth;
    private Long authViewCountLastMonth;

    private Integer favoriteCount;
}
