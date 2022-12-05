import Gem from "../models/Gem.js";


const index = async (user_id) => {

    const available = await Gem.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  return available ? available.available : 0;
};

export default index;
