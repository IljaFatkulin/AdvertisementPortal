import React from 'react';

const ImageConverter = ({ data, className }) => {
    return (
        <img className={className} src={`data:image/jpeg;base64,${data}`}  alt={""}/>
    );
};

export default ImageConverter;