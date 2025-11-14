import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import SymptomPlant from '../models/SymptomPlant.js';
import HerbalPlant from '../models/HerbalPlant.js';
import ConsultRequest from '../models/ConsultRequest.js';
import Feedback from '../models/Feedback.js';
import Consultation from '../models/Consultation.js';
import QuizQuestion from '../models/QuizQuestion.js';
import DailyUpdate from '../models/DailyUpdate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import dayjs from 'dayjs';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  password: Joi.string().min(6).required(),
});

router.post('/register', async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(value.password, 10);
    const user = await User.create({
      name: value.name,
      email: value.email,
      phone: value.phone,
      passwordHash,
    });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) { next(err); }
});

const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
router.post('/login', async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(value.password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash').populate('cart.product');
    res.json(user);
  } catch (err) { next(err); }
});

const profileSchema = Joi.object({
  name: Joi.string().min(2),
  phone: Joi.string().allow('', null),
  address: Joi.object({
    line1: Joi.string().allow('', null),
    line2: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    postalCode: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
  }).allow(null),
});

router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const { value, error } = profileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await User.findByIdAndUpdate(req.user.id, value, { new: true }).select('-passwordHash');
    res.json(updated);
  } catch (err) { next(err); }
});

// ===== PRODUCTS ROUTES =====
router.get('/products', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { next(err); }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { next(err); }
});

const productSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid('plant', 'seed', 'herbal').required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(),
  availability: Joi.number().min(0).required(),
  imageUrl: Joi.string().uri().allow('', null),
  healthBenefits: Joi.array().items(Joi.string()).default([]),
});

router.post('/products', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { value, error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await Product.create(value);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.put('/products/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { value, error } = productSchema.min(1).validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await Product.findByIdAndUpdate(req.params.id, value, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/products/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ===== CART & ORDERS ROUTES =====
router.get('/cart', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart || []);
  } catch (err) { next(err); }
});

const addSchema = Joi.object({ productId: Joi.string().required(), quantity: Joi.number().integer().min(1).default(1) });
router.post('/cart', requireAuth, async (req, res, next) => {
  try {
    const { value, error } = addSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const product = await Product.findById(value.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = await User.findById(req.user.id);
    const existing = user.cart.find((c) => c.product.toString() === product._id.toString());
    if (existing) {
      existing.quantity += value.quantity;
    } else {
      user.cart.push({ product: product._id, quantity: value.quantity, priceAtAddTime: product.price });
    }
    await user.save();
    const populated = await user.populate('cart.product');
    res.status(201).json(populated.cart);
  } catch (err) { next(err); }
});

router.delete('/cart/:productId', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter((c) => c.product.toString() !== req.params.productId);
    await user.save();
    const populated = await user.populate('cart.product');
    res.json(populated.cart);
  } catch (err) { next(err); }
});

router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user.cart || user.cart.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    // Verify availability
    for (const item of user.cart) {
      if (!item.product || item.product.availability < item.quantity) {
        return res.status(400).json({ message: `Insufficient availability for ${item?.product?.name || 'item'}` });
      }
    }
    // Create order
    const items = user.cart.map((c) => ({
      product: c.product._id,
      name: c.product.name,
      price: c.product.price,
      quantity: c.quantity,
      imageUrl: c.product.imageUrl,
    }));
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const order = await Order.create({ user: user._id, items, subtotal, shippingAddress: user.address });
    // Decrement stock
    for (const c of user.cart) {
      await Product.findByIdAndUpdate(c.product._id, { $inc: { availability: -c.quantity } });
    }
    // Clear cart
    user.cart = [];
    await user.save();
    res.status(201).json(order);
  } catch (err) { next(err); }
});

router.get('/orders', requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
});

// ===== HEALTH FEATURES ROUTES =====
// Symptom → plants
router.get('/symptoms', async (req, res, next) => {
  try {
    const { q, symptoms } = req.query;
    if (!q && !symptoms) return res.json([]);
    // Backward compatible: if q provided, search SymptomPlant
    if (q) {
      const results = await SymptomPlant.find({ symptom: { $regex: q, $options: 'i' } }).populate('product');
      return res.json(results);
    }
    // New: multi-symptom union search against HerbalPlant collection
    const list = Array.isArray(symptoms)
      ? symptoms
      : String(symptoms).split(',').map((s) => s.trim()).filter(Boolean);
    const plants = await HerbalPlant.find({ symptoms: { $in: list.map((s) => new RegExp(`^${s}$`, 'i')) } })
      .sort({ commonName: 1 })
      .lean();
    return res.json(plants);
  } catch (err) { next(err); }
});

// Plants search/details
router.get('/plants', async (req, res, next) => {
  try {
    const { q, name } = req.query;
    const filter = {};
    if (name) {
      filter.$or = [
        { commonName: { $regex: name, $options: 'i' } },
        { scientificName: { $regex: name, $options: 'i' } },
      ];
    }
    if (q) {
      const tokens = String(q)
        .split(/[^a-zA-Z]+/g)
        .map((t) => t.trim())
        .filter(Boolean);
      const regexes = tokens.map((t) => new RegExp(t, 'i'));
      filter.$or = [
        ...(filter.$or || []),
        { commonName: { $in: regexes } },
        { scientificName: { $in: regexes } },
        { symptoms: { $in: regexes } },
        { description: { $in: regexes } },
      ];
    }
    const plants = await HerbalPlant.find(Object.keys(filter).length ? filter : {})
      .sort({ commonName: 1 })
      .lean();
    res.json(plants);
  } catch (err) { next(err); }
});

// Plant scanner prototype
router.post('/plant-scanner', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    // Stub: echo back a pretend plant name
    res.json({ plantName: 'Tulsi (Holy Basil)', uses: ['Respiratory relief', 'Immunity support'], prototype: true });
  } catch (err) { next(err); }
});

// Consultation
const consultSchema = Joi.object({ scheduledAt: Joi.date().iso().required(), notes: Joi.string().allow('', null) });
router.post('/consultations', requireAuth, async (req, res, next) => {
  try {
    const { value, error } = consultSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await Consultation.create({ user: req.user.id, scheduledAt: value.scheduledAt, notes: value.notes });
    res.status(201).json(created);
  } catch (err) { next(err); }
});
router.get('/consultations', requireAuth, async (req, res, next) => {
  try {
    const list = await Consultation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});

// Feedback
const feedbackSchema = Joi.object({ message: Joi.string().min(5).required(), rating: Joi.number().min(1).max(5) });
router.post('/feedback', requireAuth, async (req, res, next) => {
  try {
    const { value, error } = feedbackSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await Feedback.create({ user: req.user.id, ...value });
    res.status(201).json(created);
  } catch (err) { next(err); }
});
router.get('/feedback', requireAuth, async (req, res, next) => {
  try {
    const list = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});

// Chatbot (rule-based from symptom store)
router.get('/chatbot', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'q is required' });
    const text = String(q);
    const tokens = text.split(/[^a-zA-Z]+/g).map((t) => t.trim()).filter(Boolean);
    const regexes = tokens.map((t) => new RegExp(t, 'i'));

    // Find plants by name/symptoms/description
    const plants = await HerbalPlant.find({
      $or: [
        { commonName: { $in: regexes } },
        { scientificName: { $in: regexes } },
        { symptoms: { $in: regexes } },
        { description: { $in: regexes } },
      ],
    })
      .sort({ commonName: 1 })
      .limit(8)
      .lean();

    // Also look up symptom mapping table for additional hints
    const symptomMatches = await SymptomPlant.find({ symptom: { $in: regexes } })
      .limit(10)
      .lean();

    res.json({
      query: q,
      plants,
      symptomMatches,
      message: plants.length || symptomMatches.length ? 'Here are some suggestions' : 'No matches found',
    });
  } catch (err) { next(err); }
});

// AI chat (OpenAI compatible). Falls back to heuristic if no API key
router.post('/ai-chat', aiLimiter, async (req, res, next) => {
  try {
    const { messages } = req.body || {};
    
    // Multiple AI provider support
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
    const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';
    
    // Get relevant plant context for better responses
    const last = (messages || []).slice().reverse().find((m) => m.role === 'user');
    const userQuery = last?.content || '';
    
    // Enhanced plant context retrieval
    const tokens = String(userQuery).split(/[^a-zA-Z]+/g).map((t) => t.trim()).filter(Boolean);
    const regexes = tokens.map((t) => new RegExp(t, 'i'));
    
    const relevantPlants = await HerbalPlant.find({
      $or: [
        { commonName: { $in: regexes } },
        { scientificName: { $in: regexes } },
        { symptoms: { $in: regexes } },
        { description: { $in: regexes } },
      ],
    })
      .sort({ commonName: 1 })
      .limit(10)
      .lean();

    // Create enhanced system prompt with plant context
    const plantContext = relevantPlants.length > 0 
      ? `\n\nRelevant plants from our database:\n${relevantPlants.map(p => 
          `- ${p.commonName} (${p.scientificName}): ${p.description} Uses: ${Array.isArray(p.symptoms) ? p.symptoms.join(', ') : 'Various'}. Preparation: ${p.preparation}. Safety: ${p.safetyNotes}`
        ).join('\n')}`
      : '';

    const enhancedSystemPrompt = `You are Sanjeevani Garden's AI assistant, an expert in Ayurveda and herbal medicine. You help users learn about medicinal plants, their uses, and preparation methods.

GUIDELINES:
- Provide accurate, helpful information about herbs and natural remedies
- Always mention safety precautions and suggest consulting healthcare providers
- Use the plant database context when available
- Be conversational but professional
- If asked about serious medical conditions, recommend consulting a doctor
- Include preparation methods when discussing herbs
- Mention both common and scientific names when possible

${plantContext}

Answer the user's question based on this context and your knowledge of herbal medicine.`;

    // Try different AI providers in order of preference
    if (GROQ_API_KEY && Array.isArray(messages) && messages.length) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${GROQ_API_KEY}` 
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192', // Fast and good for conversational AI
            messages: [
              { role: 'system', content: enhancedSystemPrompt },
              ...messages,
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
          return res.json({ reply, provider: 'groq' });
        }
      } catch (error) {
        console.log('Groq API failed, trying next provider...');
      }
    }

    if (OPENAI_API_KEY && Array.isArray(messages) && messages.length) {
      try {
        const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com';
        const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        
        const response = await fetch(`${OPENAI_BASE_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              { role: 'system', content: enhancedSystemPrompt },
              ...messages,
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
          return res.json({ reply, provider: 'openai' });
        }
      } catch (error) {
        console.log('OpenAI API failed, trying next provider...');
      }
    }

    if (HUGGINGFACE_API_KEY && Array.isArray(messages) && messages.length) {
      try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: userQuery,
            parameters: {
              max_length: 500,
              temperature: 0.7,
            }
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const reply = data[0]?.generated_text || 'Sorry, I could not generate a response.';
          return res.json({ reply, provider: 'huggingface' });
        }
      } catch (error) {
        console.log('HuggingFace API failed, using fallback...');
      }
    }

    // Enhanced fallback with intelligent plant matching
    const symptomKeywords = ['cough', 'cold', 'fever', 'headache', 'pain', 'stress', 'anxiety', 'skin', 'acne', 'digestion', 'nausea', 'insomnia', 'inflammation', 'infection', 'immunity'];
    const detectedSymptoms = symptomKeywords.filter(symptom => 
      userQuery.toLowerCase().includes(symptom)
    );

    if (relevantPlants.length > 0) {
      const plantSuggestions = relevantPlants.slice(0, 3).map(p => {
        const uses = Array.isArray(p.symptoms) ? p.symptoms.slice(0, 3).join(', ') : 'various uses';
        return `🌿 **${p.commonName}** (${p.scientificName})\n   Uses: ${uses}\n   Preparation: ${p.preparation}\n   ⚠️ Safety: ${p.safetyNotes}`;
      }).join('\n\n');

      const reply = `Based on your query, here are some herbal suggestions from our Sanjeevani Garden database:\n\n${plantSuggestions}\n\n💡 **Important**: These are traditional uses. Please consult with a healthcare provider before using any herbal remedies, especially if you have medical conditions or take medications.`;
      
      return res.json({ reply, fallback: true, provider: 'database' });
    }

    // General herbal guidance fallback
    const generalAdvice = detectedSymptoms.length > 0 
      ? `I understand you're asking about ${detectedSymptoms.join(', ')}. While I don't have specific plant matches in our database right now, I recommend:\n\n🔍 Try searching for specific plant names like "tulsi", "neem", "ashwagandha"\n📚 Browse our plant collection for traditional remedies\n👨‍⚕️ Always consult healthcare providers for medical concerns\n\nWhat specific herb or plant would you like to learn about?`
      : `Hello! I'm your Sanjeevani Garden assistant. I can help you learn about:\n\n🌿 Medicinal plants and their uses\n💊 Traditional Ayurvedic remedies\n🍵 Herbal preparation methods\n⚠️ Safety information for herbs\n\nTry asking about specific symptoms (like "cough" or "stress") or plant names (like "tulsi" or "ashwagandha").`;

    res.json({ reply: generalAdvice, fallback: true, provider: 'general' });
  } catch (err) { 
    next(err); 
  }
});

// Public consult request (no auth)
router.post('/consult-requests', async (req, res, next) => {
  try {
    const { name, email, problem } = req.body || {};
    if (!name || !email || !problem) return res.status(400).json({ message: 'name, email, and problem are required' });
    const created = await ConsultRequest.create({ name, email, problem });
    res.status(201).json(created);
  } catch (err) { next(err); }
});

// Quiz
router.get('/quiz', async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find().limit(10);
    res.json(questions);
  } catch (err) { next(err); }
});

const quizSubmitSchema = Joi.object({ answers: Joi.array().items(Joi.number().min(0)).required() });
router.post('/quiz/submit', requireAuth, async (req, res, next) => {
  try {
    const { value, error } = quizSubmitSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const questions = await QuizQuestion.find();
    let total = 0;
    value.answers.forEach((idx, i) => {
      const q = questions[i];
      if (q && q.options[idx]) total += q.options[idx].points || 0;
    });
    res.json({ healthPoints: total });
  } catch (err) { next(err); }
});

// Daily plant update
router.get('/daily-plant', async (req, res, next) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    let item = await DailyUpdate.findOne({ date: today });
    if (!item) {
      // Fallback rotate by day index
      const count = await DailyUpdate.countDocuments();
      const any = await DailyUpdate.findOne().skip(Math.max(0, (new Date().getDate() - 1) % Math.max(1, count)));
      item = any || { date: today, plantName: 'Aloe Vera', details: 'Soothing and skin-friendly', imageUrl: '' };
    }
    res.json(item);
  } catch (err) { next(err); }
});

// ===== ADMIN SEED ROUTES =====
router.post('/seed', async (req, res, next) => {
  try {
    const products = await Product.insertMany([
      { name: 'Tulsi Plant', category: 'plant', description: 'Holy Basil', price: 199, availability: 20, imageUrl: '', healthBenefits: ['Respiratory', 'Immunity'] },
      { name: 'Aloe Vera', category: 'plant', description: 'Skin care', price: 149, availability: 25, imageUrl: '', healthBenefits: ['Skin', 'Digestion'] },
      { name: 'Neem Leaves Powder', category: 'herbal', description: 'Antibacterial', price: 129, availability: 40, imageUrl: '', healthBenefits: ['Skin', 'Detox'] },
    ]);

    await SymptomPlant.insertMany([
      { symptom: 'cough', plantName: 'Tulsi', usage: 'Boil leaves with ginger and drink', product: products[0]._id },
      { symptom: 'skin', plantName: 'Aloe Vera', usage: 'Apply gel on affected area', product: products[1]._id },
      { symptom: 'acne', plantName: 'Neem', usage: 'Use neem powder paste', product: products[2]._id },
    ]);

    // Seed 50+ herbal plants
    const plants = [
      { commonName: 'Tulsi', scientificName: 'Ocimum tenuiflorum', imageUrl: '/tulsi-plant-healing.jpg', symptoms: ['cough','cold','fever','respiratory','stress'], description: 'Boosts immunity and supports respiratory health.', preparation: 'Tea: Boil leaves with ginger and honey.', safetyNotes: 'May lower blood sugar; avoid excess in pregnancy.' },
      { commonName: 'Neem', scientificName: 'Azadirachta indica', imageUrl: '/neem-tree-leaves-medicinal-plant.jpg', symptoms: ['skin','acne','infection','blood sugar'], description: 'Antibacterial and skin-friendly herb.', preparation: 'Paste: Apply neem leaf paste on skin.', safetyNotes: 'High doses may be hepatotoxic; avoid during pregnancy.' },
      { commonName: 'Aloe Vera', scientificName: 'Aloe barbadensis', imageUrl: '/aloe-vera-succulent-plant-healing.jpg', symptoms: ['skin','burns','constipation','digestion'], description: 'Soothes skin and aids digestion.', preparation: 'Gel: Apply topically; Juice: consume in moderation.', safetyNotes: 'Latex may cause cramps; avoid in pregnancy.' },
      { commonName: 'Ashwagandha', scientificName: 'Withania somnifera', imageUrl: '/ashwagandha-root-medicinal-herb.jpg', symptoms: ['stress','anxiety','fatigue','insomnia'], description: 'Adaptogen that reduces stress and improves energy.', preparation: 'Powder with warm milk at night.', safetyNotes: 'May interact with sedatives and thyroid meds.' },
      { commonName: 'Turmeric', scientificName: 'Curcuma longa', imageUrl: '/turmeric-root-golden-spice-medicinal.jpg', symptoms: ['inflammation','joint pain','skin','digestion'], description: 'Contains curcumin, a powerful anti-inflammatory.', preparation: 'Golden milk or capsules with pepper.', safetyNotes: 'May thin blood; caution with anticoagulants.' },
      { commonName: 'Brahmi', scientificName: 'Bacopa monnieri', imageUrl: '/brahmi-bacopa-monnieri-herb-brain-health.jpg', symptoms: ['memory','anxiety','stress'], description: 'Supports memory and cognitive function.', preparation: 'Tea or standardized extract.', safetyNotes: 'May cause nausea in high doses.' },
      { commonName: 'Ginger', scientificName: 'Zingiber officinale', imageUrl: '/ginger-plant-with-roots-in-pot.jpg', symptoms: ['nausea','cold','cough','digestion','inflammation'], description: 'Warming root for nausea and digestion.', preparation: 'Tea: Boil slices; Powder in food.', safetyNotes: 'May interact with anticoagulants.' },
      { commonName: 'Mint', scientificName: 'Mentha spicata', imageUrl: '/fresh-mint-plant-in-pot.jpg', symptoms: ['digestion','gas','headache'], description: 'Cooling herb aids digestion.', preparation: 'Tea or fresh leaves in water.', safetyNotes: 'May worsen GERD in some people.' },
      { commonName: 'Giloy', scientificName: 'Tinospora cordifolia', imageUrl: '', symptoms: ['fever','immunity','infection'], description: 'Immunity booster used for fevers.', preparation: 'Decoction of stems.', safetyNotes: 'Overuse may affect liver enzymes.' },
      { commonName: 'Amla', scientificName: 'Phyllanthus emblica', imageUrl: '', symptoms: ['immunity','digestion','skin','hair'], description: 'Rich in vitamin C; rejuvenative.', preparation: 'Juice or powder (churna).', safetyNotes: 'Generally safe; may lower blood sugar.' },
      { commonName: 'Triphala', scientificName: 'Emblica officinalis + Terminalia spp.', imageUrl: '', symptoms: ['constipation','digestion','detox'], description: 'Classic digestive and detox formula.', preparation: 'Powder at bedtime with warm water.', safetyNotes: 'Loose stools in high doses.' },
      { commonName: 'Mulethi', scientificName: 'Glycyrrhiza glabra', imageUrl: '', symptoms: ['cough','sore throat','ulcers'], description: 'Soothes throat and GI lining.', preparation: 'Tea/decoction.', safetyNotes: 'Can raise blood pressure with chronic high use.' },
      { commonName: 'Tulsi Kapoori', scientificName: 'Ocimum kilimandscharicum', imageUrl: '', symptoms: ['cough','cold','sinus'], description: 'Aromatic tulsi for respiratory support.', preparation: 'Steam inhalation or tea.', safetyNotes: 'Avoid excess in pregnancy.' },
      { commonName: 'Arjuna', scientificName: 'Terminalia arjuna', imageUrl: '', symptoms: ['heart','blood pressure','cholesterol'], description: 'Supports cardiac function.', preparation: 'Bark decoction or capsules.', safetyNotes: 'Monitor with cardiac medications.' },
      { commonName: 'Gokshura', scientificName: 'Tribulus terrestris', imageUrl: '', symptoms: ['urinary','kidney','vitality'], description: 'Diuretic and tonic.', preparation: 'Powder or capsules.', safetyNotes: 'May affect hormones; consult if on therapy.' },
      { commonName: 'Punarnava', scientificName: 'Boerhavia diffusa', imageUrl: '', symptoms: ['edema','liver','urinary'], description: 'Reduces water retention.', preparation: 'Decoction.', safetyNotes: 'Consult in kidney disorders.' },
      { commonName: 'Shatavari', scientificName: 'Asparagus racemosus', imageUrl: '', symptoms: ['women health','menopause','acidity'], description: 'Female reproductive tonic; cooling.', preparation: 'Powder with milk.', safetyNotes: 'Allergy possible in asparagus-sensitive individuals.' },
      { commonName: 'Shankhpushpi', scientificName: 'Convolvulus pluricaulis', imageUrl: '', symptoms: ['memory','anxiety','sleep'], description: 'Calming nootropic.', preparation: 'Syrup or tea.', safetyNotes: 'Sedation possible with high dose.' },
      { commonName: 'Cinnamon', scientificName: 'Cinnamomum verum', imageUrl: '', symptoms: ['blood sugar','digestion','cold'], description: 'Warming spice aids metabolism.', preparation: 'Tea or food spice.', safetyNotes: 'Cassia variety may affect liver in excess.' },
      { commonName: 'Clove', scientificName: 'Syzygium aromaticum', imageUrl: '', symptoms: ['toothache','infection','cold'], description: 'Antimicrobial spice; analgesic.', preparation: 'Oil topically diluted; tea.', safetyNotes: 'Clove oil can irritate; dilute properly.' },
      { commonName: 'Cardamom', scientificName: 'Elettaria cardamomum', imageUrl: '', symptoms: ['digestion','bad breath','nausea'], description: 'Aromatic digestive.', preparation: 'Chew pods; tea.', safetyNotes: 'Generally safe.' },
      { commonName: 'Black Pepper', scientificName: 'Piper nigrum', imageUrl: '', symptoms: ['digestion','respiratory','metabolism'], description: 'Enhances bioavailability.', preparation: 'With turmeric (piperine).', safetyNotes: 'May irritate GI in excess.' },
      { commonName: 'Holy Basil (Vana)', scientificName: 'Ocimum gratissimum', imageUrl: '', symptoms: ['stress','respiratory'], description: 'Aromatic tulsi variety.', preparation: 'Tea.', safetyNotes: 'Similar to tulsi notes.' },
      { commonName: 'Fenugreek', scientificName: 'Trigonella foenum-graecum', imageUrl: '', symptoms: ['blood sugar','lactation','digestion'], description: 'Balances sugar and aids digestion.', preparation: 'Seeds soaked; powder.', safetyNotes: 'May cause body odor; lowers sugar.' },
      { commonName: 'Coriander', scientificName: 'Coriandrum sativum', imageUrl: '', symptoms: ['digestion','detox','fever'], description: 'Cooling digestive herb.', preparation: 'Seeds decoction; chutney.', safetyNotes: 'Generally safe.' },
      { commonName: 'Cumin', scientificName: 'Cuminum cyminum', imageUrl: '', symptoms: ['digestion','bloating'], description: 'Carminative spice.', preparation: 'Jeera water.', safetyNotes: 'Generally safe.' },
      { commonName: 'Hibiscus', scientificName: 'Hibiscus rosa-sinensis', imageUrl: '', symptoms: ['hair','blood pressure'], description: 'Supports hair and BP.', preparation: 'Tea; hair oil infusion.', safetyNotes: 'May lower BP.' },
      { commonName: 'Basil (Sweet)', scientificName: 'Ocimum basilicum', imageUrl: '', symptoms: ['digestion','stress'], description: 'Aromatic culinary basil.', preparation: 'Tea; food.', safetyNotes: 'Generally safe.' },
      { commonName: 'Peppermint', scientificName: 'Mentha × piperita', imageUrl: '', symptoms: ['digestion','headache'], description: 'Cooling, for IBS and headache.', preparation: 'Tea; oil inhalation.', safetyNotes: 'May worsen reflux.' },
      { commonName: 'Licorice', scientificName: 'Glycyrrhiza glabra', imageUrl: '', symptoms: ['cough','ulcer'], description: 'Soothing demulcent.', preparation: 'Tea.', safetyNotes: 'Hypertension risk with chronic use.' },
      { commonName: 'Guduchi', scientificName: 'Tinospora cordifolia', imageUrl: '', symptoms: ['fever','immunity'], description: 'See Giloy.', preparation: 'Decoction.', safetyNotes: 'Liver caution with overuse.' },
      { commonName: 'Bael', scientificName: 'Aegle marmelos', imageUrl: '', symptoms: ['diarrhea','digestion'], description: 'Unripe fruit for diarrhea.', preparation: 'Pulp or sherbet.', safetyNotes: 'Constipation if overused.' },
      { commonName: 'Haritaki', scientificName: 'Terminalia chebula', imageUrl: '', symptoms: ['constipation','detox'], description: 'Part of Triphala.', preparation: 'Powder.', safetyNotes: 'May cause loose stools.' },
      { commonName: 'Bibhitaki', scientificName: 'Terminalia bellirica', imageUrl: '', symptoms: ['respiratory','detox'], description: 'Part of Triphala.', preparation: 'Powder.', safetyNotes: 'Generally safe.' },
      { commonName: 'Tulsi Rama', scientificName: 'Ocimum sanctum', imageUrl: '', symptoms: ['cough','cold','stress'], description: 'Common tulsi variety.', preparation: 'Tea.', safetyNotes: 'See tulsi.' },
      { commonName: 'Saffron', scientificName: 'Crocus sativus', imageUrl: '', symptoms: ['mood','skin'], description: 'Uplifts mood and brightens skin.', preparation: 'Infuse in milk.', safetyNotes: 'Very high doses unsafe.' },
      { commonName: 'Nigella', scientificName: 'Nigella sativa', imageUrl: '', symptoms: ['immunity','respiratory','metabolism'], description: 'Black seed supports immunity.', preparation: 'Oil or seed.', safetyNotes: 'May lower BP and sugar.' },
      { commonName: 'Curry Leaf', scientificName: 'Murraya koenigii', imageUrl: '', symptoms: ['digestion','diabetes'], description: 'Aids sugar control and digestion.', preparation: 'Fresh leaves in diet.', safetyNotes: 'Generally safe.' },
      { commonName: 'Tulsi Krishna', scientificName: 'Ocimum tenuiflorum (Krishna)', imageUrl: '', symptoms: ['respiratory','stress'], description: 'Dark-leaf tulsi variety.', preparation: 'Tea.', safetyNotes: 'See tulsi.' },
      { commonName: 'Gotu Kola', scientificName: 'Centella asiatica', imageUrl: '', symptoms: ['memory','circulation','skin'], description: 'Supports cognition and skin healing.', preparation: 'Tea or capsules.', safetyNotes: 'High doses may cause headache.' },
      { commonName: 'Moringa', scientificName: 'Moringa oleifera', imageUrl: '', symptoms: ['nutrition','inflammation','energy'], description: 'Nutrient-dense leaves.', preparation: 'Powder in smoothies.', safetyNotes: 'May lower BP and sugar.' },
      { commonName: 'Tulsi Amrita', scientificName: 'Ocimum species (blend)', imageUrl: '', symptoms: ['stress','immunity'], description: 'Tulsi blend tea.', preparation: 'Tea.', safetyNotes: 'Generally safe.' },
      { commonName: 'Sandalwood', scientificName: 'Santalum album', imageUrl: '', symptoms: ['skin','acne','inflammation'], description: 'Cooling, aromatic wood for skin.', preparation: 'Paste topically.', safetyNotes: 'Topical use preferred.' },
      { commonName: 'Manjistha', scientificName: 'Rubia cordifolia', imageUrl: '', symptoms: ['skin','acne','detox'], description: 'Blood purifier for skin health.', preparation: 'Capsules or decoction.', safetyNotes: 'May discolor urine.' },
      { commonName: 'Neem Oil', scientificName: 'Azadirachta indica (oil)', imageUrl: '', symptoms: ['skin','scalp','lice'], description: 'Antimicrobial topical oil.', preparation: 'Dilute and apply.', safetyNotes: 'Do not ingest oil.' },
      { commonName: 'Tulsi Oil', scientificName: 'Ocimum spp. (oil)', imageUrl: '', symptoms: ['respiratory','stress'], description: 'Aromatic oil for inhalation.', preparation: 'Diffuser/inhalation.', safetyNotes: 'Dilute before skin use.' },
      { commonName: 'Mustard', scientificName: 'Brassica juncea', imageUrl: '', symptoms: ['pain','circulation','cold'], description: 'Warming seed/oil.', preparation: 'Oil massage; poultice.', safetyNotes: 'May irritate sensitive skin.' },
      { commonName: 'Garlic', scientificName: 'Allium sativum', imageUrl: '', symptoms: ['cholesterol','infection','blood pressure'], description: 'Cardiometabolic support.', preparation: 'Raw/cloves; capsules.', safetyNotes: 'Blood-thinning; odor.' },
      { commonName: 'Onion', scientificName: 'Allium cepa', imageUrl: '', symptoms: ['cough','cholesterol'], description: 'Traditional home remedy.', preparation: 'Syrup with honey.', safetyNotes: 'GI irritation possible.' },
      { commonName: 'Tulsi Panchang', scientificName: 'Ocimum spp. (whole plant)', imageUrl: '', symptoms: ['fever','respiratory','stress'], description: 'Whole-plant tulsi use.', preparation: 'Decoction.', safetyNotes: 'See tulsi.' },
      { commonName: 'Lavender', scientificName: 'Lavandula angustifolia', imageUrl: '', symptoms: ['anxiety','insomnia','headache'], description: 'Calming aromatic flower.', preparation: 'Tea; aroma.', safetyNotes: 'Oil may irritate undiluted.' },
      { commonName: 'Chamomile', scientificName: 'Matricaria chamomilla', imageUrl: '', symptoms: ['insomnia','anxiety','digestion'], description: 'Soothing bedtime tea.', preparation: 'Infusion.', safetyNotes: 'Ragweed allergy caution.' },
      { commonName: 'Tulsi Lemon', scientificName: 'Ocimum spp. (lemon basil)', imageUrl: '', symptoms: ['stress','digestion'], description: 'Citrusy tulsi variety.', preparation: 'Tea.', safetyNotes: 'Generally safe.' },
      { commonName: 'Black Seed Oil', scientificName: 'Nigella sativa (oil)', imageUrl: '', symptoms: ['immunity','respiratory'], description: 'Thymoquinone-rich oil.', preparation: 'Small daily dose.', safetyNotes: 'BP/sugar lowering.' },
      { commonName: 'Gudmar', scientificName: 'Gymnema sylvestre', imageUrl: '', symptoms: ['diabetes','sugar cravings'], description: 'Reduces sweet taste sensation.', preparation: 'Capsules/tea.', safetyNotes: 'Monitor blood sugar.' },
      { commonName: 'Kutki', scientificName: 'Picrorhiza kurroa', imageUrl: '', symptoms: ['liver','fever'], description: 'Bitter liver support.', preparation: 'Powder/capsules.', safetyNotes: 'Potent bitter; dose carefully.' },
      { commonName: 'Bhringraj', scientificName: 'Eclipta alba', imageUrl: '', symptoms: ['hair','liver'], description: 'Hair and liver tonic.', preparation: 'Oil for scalp; capsules.', safetyNotes: 'Generally safe.' },
      { commonName: 'Trikatu', scientificName: 'Piper longum + Piper nigrum + Zingiber officinale', imageUrl: '', symptoms: ['digestion','metabolism','respiratory'], description: 'Warming trio aiding bioavailability.', preparation: 'Powder with honey.', safetyNotes: 'Irritating in gastritis.' },
      { commonName: 'Long Pepper', scientificName: 'Piper longum', imageUrl: '', symptoms: ['respiratory','digestion'], description: 'Deepana-Pachana (digestive fire).', preparation: 'Powder with honey.', safetyNotes: 'Avoid in ulcers.' },
      { commonName: 'Hing', scientificName: 'Ferula asafoetida', imageUrl: '', symptoms: ['gas','bloating','colic'], description: 'Potent carminative.', preparation: 'Pinch in warm water.', safetyNotes: 'Strong taste; avoid high doses in pregnancy.' },
      { commonName: 'Sarpagandha', scientificName: 'Rauwolfia serpentina', imageUrl: '', symptoms: ['hypertension','anxiety'], description: 'Potent antihypertensive (classical).', preparation: 'Only under supervision.', safetyNotes: 'Prescription-guided use only.' },
      { commonName: 'Tulsi Kapoor', scientificName: 'Ocimum spp.', imageUrl: '', symptoms: ['cold','cough'], description: 'Aromatic variety for colds.', preparation: 'Tea; steam.', safetyNotes: 'See tulsi.' },
      { commonName: 'Patharchatta', scientificName: 'Kalanchoe pinnata', imageUrl: '', symptoms: ['kidney stones','urinary'], description: 'Traditional lithotriptic.', preparation: 'Leaf juice (traditional).', safetyNotes: 'Evidence limited; consult physician.' },
      { commonName: 'Cissus', scientificName: 'Cissus quadrangularis', imageUrl: '', symptoms: ['bone health','fractures'], description: 'Bone support herb.', preparation: 'Capsules.', safetyNotes: 'Monitor if on meds.' },
      { commonName: 'Safed Musli', scientificName: 'Chlorophytum borivilianum', imageUrl: '', symptoms: ['vitality','stamina'], description: 'Ayurvedic rasayana.', preparation: 'Powder with milk.', safetyNotes: 'Quality varies; source carefully.' },
      { commonName: 'Kaunch', scientificName: 'Mucuna pruriens', imageUrl: '', symptoms: ['Parkinsons support','vitality'], description: 'Natural L-DOPA source.', preparation: 'Standardized extract.', safetyNotes: 'Interactions with dopamine meds.' },
      { commonName: 'Guggul', scientificName: 'Commiphora wightii', imageUrl: '', symptoms: ['cholesterol','inflammation'], description: 'Resin for lipid support.', preparation: 'Classical guggulu formulas.', safetyNotes: 'May irritate in gastritis.' },
      { commonName: 'Turmeric Oil', scientificName: 'Curcuma longa (oil)', imageUrl: '', symptoms: ['skin','pain'], description: 'Topical anti-inflammatory.', preparation: 'Diluted application.', safetyNotes: 'Stains skin/clothes.' },
      { commonName: 'Neem Capsules', scientificName: 'Azadirachta indica (capsules)', imageUrl: '', symptoms: ['skin','acne','detox'], description: 'Convenient neem form.', preparation: 'Per label.', safetyNotes: 'Liver caution with high doses.' },
      { commonName: 'Amla Powder', scientificName: 'Phyllanthus emblica (powder)', imageUrl: '', symptoms: ['immunity','digestion','hair'], description: 'Vitamin C rich powder.', preparation: 'With water or honey.', safetyNotes: 'May lower sugar.' },
      { commonName: 'Tulsi Drops', scientificName: 'Ocimum spp. (extract)', imageUrl: '', symptoms: ['respiratory','immunity','stress'], description: 'Concentrated tulsi extract.', preparation: 'Drops in warm water.', safetyNotes: 'Follow label dosing.' },
    ];

    await HerbalPlant.insertMany(plants);

    await QuizQuestion.insertMany([
      { question: 'How much water should you drink daily?', options: [{ text: '1-2 glasses', points: 0 }, { text: '6-8 glasses', points: 10 }] },
      { question: 'Best time to exercise?', options: [{ text: 'After heavy meal', points: 0 }, { text: 'Morning/Evening', points: 10 }] },
    ]);

    await DailyUpdate.insertMany([
      { date: '2025-01-01', plantName: 'Turmeric', details: 'Anti-inflammatory properties', imageUrl: '' },
      { date: '2025-01-02', plantName: 'Ashwagandha', details: 'Stress relief adaptogen', imageUrl: '' },
    ]);

    res.json({ ok: true, counts: { products: products.length, symptomPlants: 3, herbalPlants: plants.length } });
  } catch (err) { next(err); }
});

export default router;


