const coffee = async (req, res) => {
  try {
    res.status(418).json({
      error: "I'm a teapot",
      mensage: "O servidor se recusa a preparar o café",
    });
  } catch (err) {
    res.status(418).json({
      error: "I'm a teapot",
      mensage: "O servidor se recusa a preparar o café",
    });
  }
};

module.exports = {
  coffee,
}