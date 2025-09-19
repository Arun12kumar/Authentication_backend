// controllers/chargesController.js
import ChargesModel from "../models/chargesModel.js";

// ✅ Get current charges
export const getCharges = async (req, res) => {
  try {
    const{tax,shippingFee,discount}= req.body;
    if(!tax || !shippingFee || !discount){
        return res.status(404).json({success:false, message:"invalid charges"})
    }
    const charges = await ChargesModel.findOne();
    res.json({ success: true, data:charges });
  } catch (error) {
    console.error("Get Charges Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch charges" });
  }
};

// ✅ Admin update or create charges
export const updateCharges = async (req, res) => {
  try {
    const { tax = 0, shippingFee = 0, discount = 0 } = req.body;

    let charges = await ChargesModel.findOne();

    if (!charges) {
      charges = new ChargesModel({ tax, shippingFee, discount });
    } else {
      charges.tax = tax;
      charges.shippingFee = shippingFee;
      charges.discount = discount;
    }

    await charges.save();

    res.json({ success: true, data:charges });
  } catch (error) {
    console.error("Update Charges Error:", error);
    res.status(500).json({ success: false, message: "Failed to update charges" });
  }
};
