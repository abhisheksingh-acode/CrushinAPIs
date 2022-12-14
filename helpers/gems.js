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

const gems_history = async (user_id) => {
    const data = await Gem.find()
    .where("user_id")
    .equals(user_id)
    .sort("-_id")

  return data;
};

export default index;
export {gems_history};
