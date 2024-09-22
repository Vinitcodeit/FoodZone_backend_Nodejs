const Firm = require('../model/Firm');
const Product = require('../model/Product')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') //destination folder where the uploaded images will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); //generating a unique filename
    }
  });

  const upload = multer({storage: storage})

  const addProduct = async (req, res)=>{
  try {
    const {productName, price, category, bestseller, description} = req.body;
    const image = req.file? req.file.filename: undefined;

    const firmId = req.params.firmId
    const firm = await Firm.findById(firmId)

    if(!firm){
        return res.status(404).json({error: "No firm found"})

    }

    const product = new Product({
        productName, price, category, bestseller, description, image, firm:firm._id
    })

    const savedProduct = await product.save()
    firm.products.push(savedProduct)  //pushing products to this firm by push method
    await firm.save()  //saving this firm int this database

    res.status(200).json(savedProduct)
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal server error"})
  }
}

const getProductByFirm = async (req, res)=>{
  try {
    const firmId = req.params.firmId
    const firm = await Firm.findById(firmId)

    if(!firm){
      return res.status(404).json({error: "No Firm Found"})

    }

    const restaurantName = firm.firmName
    const products = await Product.find({firm: firmId})

    res.status(200).json({restaurantName, products})
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"})
    
  }
}

const deleteProductById = async (req, res)=>{
  try {
    const productId = req.params.productId

    const deletedProduct = await Product.findByIdAndDelete(productId)
    if(!deletedProduct){
      return res.status(404).json({error: "No product found"})
    }
    res.status(200).json({message:"Product deleted successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"})
  }
}

  module.exports = {addProduct:[upload.single('image'), addProduct], getProductByFirm, deleteProductById}

// const Firm = require('../model/Firm');
// const Product = require('../model/Product');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Set up Cloudinary storage for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'products', // Folder where images will be stored in Cloudinary
//     format: async (req, file) => 'jpeg', // You can dynamically change the format
//     public_id: (req, file) => Date.now(), // Generate a unique public ID for each image
//   },
// });

// const upload = multer({ storage: storage });

// const addProduct = async (req, res) => {
//   try {
//     const { productName, price, category, bestseller, description } = req.body;
//     // Cloudinary will handle the image upload, and you get the URL from the response
//     const image = req.file ? req.file.path : undefined;

//     const firmId = req.params.firmId;
//     const firm = await Firm.findById(firmId);

//     if (!firm) {
//       return res.status(404).json({ error: "No firm found" });
//     }

//     const product = new Product({
//       productName,
//       price,
//       category,
//       bestseller,
//       description,
//       image, // Save the Cloudinary image URL
//       firm: firm._id,
//     });

//     const savedProduct = await product.save();
//     firm.products.push(savedProduct); // Push products to this firm by the push method
//     await firm.save(); // Save this firm in the database

//     res.status(200).json(savedProduct);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getProductByFirm = async (req, res) => {
//   try {
//     const firmId = req.params.firmId;
//     const firm = await Firm.findById(firmId);

//     if (!firm) {
//       return res.status(404).json({ error: "No Firm Found" });
//     }

//     const restaurantName = firm.firmName;
//     const products = await Product.find({ firm: firmId });

//     res.status(200).json({ restaurantName, products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const deleteProductById = async (req, res) => {
//   try {
//     const productId = req.params.productId;

//     const deletedProduct = await Product.findByIdAndDelete(productId);
//     if (!deletedProduct) {
//       return res.status(404).json({ error: "No product found" });
//     }
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };
