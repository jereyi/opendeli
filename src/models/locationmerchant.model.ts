// import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
// import Location from "./location.model";
// import Merchant from "./merchant.model";
// var db = require("./db"),
//   sequelize = db.sequelize;
  
// class LocationMerchant extends Model<InferAttributes<LocationMerchant>,
//     InferCreationAttributes<LocationMerchant>> {
//     declare LocationId: ForeignKey<Location["id"]>;
//     declare MerchantId:  ForeignKey<Merchant["id"]>;
//   }
// LocationMerchant.init(
//   {
//     LocationId: {
//       type: DataTypes.UUID,
//     },
//     MerchantId: {
//       type: DataTypes.UUID,
//     },
//   },
//   {
//     // Other model options go here
//     tableName: "locationmerchants",
//     sequelize,
//   }
// );

// export default LocationMerchant;