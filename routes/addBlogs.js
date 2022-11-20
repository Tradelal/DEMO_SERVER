const express = require("express");
const blogModel = require("../model/blog.model");
const router = express.Router();

router.post("/addBlogs", async (req, res) => {
  const { image, title, description, likes, tags, slugifiedTitle } = req.body;
  let slug = slugifiedTitle
  try {
    // if (!image || !title || !description || !likes || !tags) {
    //   return res
    //     .status(422)
    //     .json({ message: "Please fill out all the details! 🔴 ", body: req.body });
    // }
    const blog = await blogModel.findOne({ title });
    if (blog) {
      return res.status(409).json({ message: "A similar blog exists! 🔴 " });
    }
    const newBlog = await blogModel.create({
      title,
      image,
      description,
      tags,
      slug
    });
    if (!newBlog) {
      res.json({
        message: "Some error occurred while adding a new blog! 🔴 ",
      });
    }
    res.status(201).json({ message: "Blog added! 🟢" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Some error occurred while adding blogs! 🔴 " });
  }
});


module.exports = router