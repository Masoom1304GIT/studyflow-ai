import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '..', 'samplePdfs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createLecturePdf(filename, meta) {
  const filePath = path.join(outputDir, filename);
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Header banner
  doc.rect(50, 40, 495, 60).fill('#1E293B');
  doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold')
     .text(meta.subject.toUpperCase(), 65, 52);
  doc.fillColor('#94A3B8').fontSize(11).font('Helvetica')
     .text(`Lecture Notes • ${meta.title}`, 65, 75);

  doc.moveDown(4);
  doc.fillColor('#0F172A').fontSize(16).font('Helvetica-Bold')
     .text('Lecture Overview', 50, 120);
  
  doc.fillColor('#334155').fontSize(10).font('Helvetica')
     .text(meta.overview, 50, 145, { width: 495, lineGap: 4 });

  let yPos = 215;
  doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold')
     .text('Key Definitions & Core Terminology', 50, yPos);
  
  yPos += 25;
  meta.definitions.forEach((item) => {
    doc.fillColor('#2563EB').fontSize(10).font('Helvetica-Bold')
       .text(`• ${item.term}: `, 50, yPos, { continued: true });
    doc.fillColor('#334155').font('Helvetica')
       .text(item.definition, { width: 495, lineGap: 3 });
    yPos = doc.y + 6;
  });

  yPos += 15;
  doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold')
     .text('Core Topics & Analytical Insights', 50, yPos);
  
  yPos += 25;
  meta.topics.forEach((topic) => {
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
       .text(topic.heading, 50, yPos);
    yPos += 16;
    topic.points.forEach((pt) => {
      doc.fillColor('#475569').fontSize(9.5).font('Helvetica')
         .text(`- ${pt}`, 65, yPos, { width: 480, lineGap: 2 });
      yPos = doc.y + 4;
    });
    yPos += 6;
  });

  if (meta.formulas && meta.formulas.length > 0) {
    if (yPos > 650) {
      doc.addPage();
      yPos = 50;
    }
    doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold')
       .text('Important Formulas & Quantitative Facts', 50, yPos);
    yPos += 25;
    meta.formulas.forEach((f) => {
      doc.rect(50, yPos, 495, 38).fill('#F1F5F9');
      doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold')
         .text(`${f.label}:  ${f.formula}`, 60, yPos + 8);
      doc.fillColor('#64748B').fontSize(8.5).font('Helvetica')
         .text(f.desc, 60, yPos + 22);
      yPos += 46;
    });
  }

  // Footer
  doc.fontSize(8).fillColor('#94A3B8')
     .text(`StudyFlow AI Sample Lecture Document • Generated for student revision verification`, 50, 780, { align: 'center', width: 495 });

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

async function run() {
  console.log('Generating sample PDFs in', outputDir);

  await createLecturePdf('CS229_Lecture4_Backprop_DeepLearning.pdf', {
    subject: 'Computer Science 229: Deep Learning',
    title: 'Neural Networks & Backpropagation Fundamentals',
    overview: 'This lecture covers the mathematical formulation of artificial neural networks, multilayer perceptrons (MLP), forward propagation, activation functions (ReLU, Sigmoid, Softmax), and gradient computation using the chain rule via Backpropagation. It highlights common optimization challenges including vanishing and exploding gradients and learning rate schedules.',
    definitions: [
      { term: 'Multilayer Perceptron (MLP)', definition: 'A feedforward artificial neural network consisting of input, hidden, and output layers of non-linearly activating nodes.' },
      { term: 'Backpropagation', definition: 'An efficient algorithmic method for computing gradients of the loss function with respect to weights using recursive application of the calculus chain rule.' },
      { term: 'Activation Function', definition: 'A non-linear mathematical operation applied to neuron pre-activations enabling deep networks to approximate continuous functions.' },
      { term: 'Vanishing Gradient Problem', definition: 'A training roadblock where gradients decay exponentially across layers when saturating activations like Sigmoid are used in deep architectures.' }
    ],
    topics: [
      {
        heading: '1. Mechanics of Forward and Backward Passes',
        points: [
          'In the forward pass, input vectors are successively mapped: Z^[l] = W^[l] * A^[l-1] + b^[l], followed by activation A^[l] = g(Z^[l]).',
          'Activations are cached in memory during forward propagation because they are required to calculate partial derivatives during the backward pass.',
          'Backpropagation computes error delta vectors recursively from the final loss L back to the first layer, achieving O(W) computational complexity.'
        ]
      },
      {
        heading: '2. Activation Functions: ReLU vs Sigmoid',
        points: [
          'Sigmoid saturates for high absolute values (|z| > 4), driving derivatives close to zero and causing severe vanishing gradients.',
          'ReLU (Rectified Linear Unit) f(z) = max(0, z) provides a constant unit gradient of 1 for all positive inputs, enabling stable training of very deep networks.',
          'Leaky ReLU addresses the dying neuron problem by assigning a small non-zero slope (e.g. 0.01) to negative values.'
        ]
      }
    ],
    formulas: [
      { label: 'Layer Pre-activation', formula: 'Z^[l] = W^[l] * A^[l-1] + b^[l]', desc: 'Affine linear transformation of previous activations with weight matrix W and bias b.' },
      { label: 'Error Delta Chain Rule', formula: 'delta^[l] = (W^[l+1]^T * delta^[l+1]) (hadamard) g\'^[l](Z^[l])', desc: 'Propagation of error backwards weighted by transposed matrix and activation derivative.' },
      { label: 'Weight Update', formula: 'W^[l] := W^[l] - alpha * (delta^[l] * (A^[l-1])^T)', desc: 'Stochastic gradient descent parameter update with learning rate alpha.' }
    ]
  });

  await createLecturePdf('BIO110_Lecture6_Cellular_Respiration.pdf', {
    subject: 'Biology 110: Principles of Biochemistry',
    title: 'Cellular Respiration & ATP Synthesis',
    overview: 'This lecture breaks down the four core stages of aerobic cellular respiration: Glycolysis, Pyruvate Oxidation, the Citric Acid (Krebs) Cycle, and Oxidative Phosphorylation. It focuses on electron carriers (NADH, FADH2), proton gradient generation across the inner mitochondrial membrane, and ATP synthase mechanics.',
    definitions: [
      { term: 'Glycolysis', definition: 'Ten-step anaerobic metabolic pathway in the cytoplasm converting 1 glucose molecule into 2 pyruvate molecules, yielding net 2 ATP and 2 NADH.' },
      { term: 'Chemiosmosis', definition: 'The flow of protons across a selectively permeable membrane down their electrochemical gradient to drive ATP synthase.' },
      { term: 'Terminal Electron Acceptor', definition: 'Molecular oxygen (O2), which accepts electrons at Complex IV of the ETC and combines with protons to form water.' }
    ],
    topics: [
      {
        heading: '1. Sequential Stages of Aerobic Catabolism',
        points: [
          'Glycolysis occurs in the cytosol without oxygen requirement, yielding 2 ATP via substrate-level phosphorylation.',
          'Pyruvate enters mitochondria and is oxidized into Acetyl-CoA, releasing carbon dioxide and yielding NADH.',
          'The Citric Acid Cycle in the mitochondrial matrix yields 6 NADH, 2 FADH2, and 2 ATP per original glucose.',
          'Oxidative phosphorylation in the inner membrane produces approximately 26 to 28 ATP molecules via the electron transport chain.'
        ]
      }
    ],
    formulas: [
      { label: 'Overall Reaction', formula: 'C6H12O6 + 6O2 -> 6CO2 + 6H2O + ~30-32 ATP', desc: 'Net stoichiometric chemical balance for aerobic cellular respiration.' },
      { label: 'Electron Carrier Yield', formula: '1 NADH ~ 2.5 ATP, 1 FADH2 ~ 1.5 ATP', desc: 'Relative proton motive force contribution based on ETC entry complex.' }
    ]
  });

  await createLecturePdf('ECON201_Lecture8_Monetary_Policy_Inflation.pdf', {
    subject: 'Economics 201: Principles of Macroeconomics',
    title: 'Inflation, Central Banking & Monetary Policy',
    overview: 'This lecture explores the mechanics of inflation (demand-pull vs cost-push), the Quantity Theory of Money, and how central banks utilize monetary policy tools (interest rates, reserve requirements, and open market operations) to stabilize prices and macroeconomic output.',
    definitions: [
      { term: 'Demand-Pull Inflation', definition: 'Inflation arising when aggregate demand exceeds productive capacity (too much money chasing too few goods).' },
      { term: 'Cost-Push Inflation', definition: 'Inflation driven by supply shocks that drastically increase production costs and shift aggregate supply leftward.' },
      { term: 'Open Market Operations (OMO)', definition: 'The purchase and sale of government bonds by a central bank to regulate commercial bank liquidity.' }
    ],
    topics: [
      {
        heading: '1. Central Bank Monetary Policy Transmission',
        points: [
          'Contractionary monetary policy involves selling bonds and raising policy interest rates to cool economic overheating.',
          'Expansionary monetary policy injects liquidity and lowers borrowing rates to stimulate investment and employment.',
          'In the long run, the Phillips Curve is vertical at the natural rate of unemployment (NAIRU).'
        ]
      }
    ],
    formulas: [
      { label: 'Equation of Exchange', formula: 'M * V = P * Y', desc: 'M = Money supply, V = Velocity of money, P = Price level, Y = Real national output.' }
    ]
  });

  console.log('Sample PDFs created successfully.');
}

run().catch(console.error);
