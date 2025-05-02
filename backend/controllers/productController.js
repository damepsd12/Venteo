const Product = require('../models/Product')

exports.createProduct = async (req, res) => {
  const { title, description, price, image, category } = req.body
  try {
    const product = new Product({
      title,
      description,
      price,
      image,
      category,
      seller: req.user._id
    })
    await product.save()
    res.status(201).json({ message: 'Produit créé', product })
  } catch (err) {
    res.status(400).json({ message: 'Erreur création', error: err.message })
  }
}

exports.validateProduct = async (req, res) => {
  const { id } = req.params
  const { action } = req.body // 'approve' ou 'reject'
  try {
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' })

    product.status = action === 'approve' ? 'approved' : 'rejected'
    await product.save()
    res.json({ message: `Produit ${action}` })
  } catch (err) {
    res.status(400).json({ message: 'Erreur', error: err.message })
  }
}

