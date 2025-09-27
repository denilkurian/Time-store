import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Tabs, Tab } from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';
import Button from '../../components/Button/Button';

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  productDetails: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ isOpen, onClose, productDetails }) => {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0); 
  const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productDetails?.id}/images`);
        const imagePaths = response.data?.data?.map((image: any) => image.attributes.file_path) || [];
        setProductImages(imagePaths);
      } catch (err) {
        console.log('No images');
      } finally {
        console.log('fetch completed');
      }
    };

    fetchImages();
  }, [productDetails?.id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="product-details"
      aria-describedby="product-details-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '75%', md: '50%' },
          bgcolor: '#fff',
          boxShadow: 6,
          p: 4,
          borderRadius: 3,
          outline: 'none',
        }}
      >
        {/* Modal Title */}
        <Typography
          variant="h5"
          sx={{
            color: '#333',
            mb: 3,
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          Product Details
        </Typography>

        {/* Tabs Section */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Images" />
          <Tab label="Details" />
        </Tabs>

        {/* Tab Panels */}
        {tabIndex === 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              mb: 3,
            }}
          >
            {productImages.length > 0 ? (
              productImages.map((imagePath, index) => (
                <img
                  key={index}
                  src={`${baseImageUrl}${imagePath}`}
                  alt={`Product ${index}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'gray' }}>
                No images available
              </Typography>
            )}
          </Box>
        )}

        {tabIndex === 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                mb: 1,
              }}
            >
              <strong>Name:</strong> {productDetails?.name || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: 'gray',
              }}
            >
              <strong>Excerpt:</strong> {productDetails?.excerpt || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: 'gray',
              }}
            >
              <strong>Description:</strong> {productDetails?.description || 'N/A'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                fontWeight: 500,
              }}
            >
              <strong>Price:</strong> ₹{productDetails?.mrp || 'N/A'}
            </Typography>
          </Box>
        )}

        {/* Action Button Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
          }}
        >
          <Button onClick={onClose} Buttonclass="w-[120px] flex item-center justify-around font-normal" type="primary">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductDetails;
