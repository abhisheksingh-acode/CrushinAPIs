import SuperLike from "../models/SuperLike.js";

const index = async (user_id) => {
  const available = await SuperLike.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  return available ? available.available : 0;
};

// const history = async (user_id) => {
//   const available = await SuperLike.find()
//     .where("user_id")
//     .select("available")
//     .equals(user_id)
//     .sort("-_id")
//     .exec();

//   return available ? available.available : 0;
// };

export default index;
