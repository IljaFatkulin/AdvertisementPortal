package iljafatkulin.advertisement.portal.util;

import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class ObjectConverter {
    private static final ModelMapper modelMapper = new ModelMapper();

    public static <S, D> D convert(S source, Class<D> destinationType) {
        return modelMapper.map(source, destinationType);
    }

    public static <S, D> List<D> convertList(List<S> sourceList, Class<D> destinationType) {
        return sourceList.stream()
                .map(source -> convert(source, destinationType))
                .collect(Collectors.toList());
    }
}