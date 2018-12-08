const followModule = {};
const db = require('../schemas');

followModule.toggleFollow = async (follower_id, following_id) => {
  const retrieve = await db.Friend.findOne({
    where: {
      follower_id: follower_id,
      following_id: following_id
    }
  });
  if (retrieve) {
    await retrieve.destroy({force:true});
    const test = await db.Friend.findOne({
      where: {
        follower_id: follower_id,
        following_id: following_id
      }
    });
  } else {
    await db.Friend.create({
      follower_id: follower_id,
      following_id: following_id
    });
  }
};

followModule.findFollowingForUser = async id => {
  const retrieve = await db.Friend.findAll({
    where: {
      follower_id: id
    }
  });
  return retrieve.map(el => el.get({ plain: true }));
};

followModule.findFollowersForUser = async id => {
  const retrieve = await db.Friend.findAll({
    where: {
      following_id: id
    }
  });
  return retrieve.map(el => el.get({ plain: true }));
};

followModule.findAll = async () => {
  let retrieve = await db.Friend.findAll({});
  retrieve = retrieve.map(el => el.get({ plain: true }));
  return retrieve;
};

module.exports = followModule;
