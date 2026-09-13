export const samplePacks = {
  cs: {
    id: "cs-neural-networks",
    subject: "Computer Science / Machine Learning",
    lectureTitle: "Neural Networks & Backpropagation Fundamentals",
    fileName: "CS229_Lecture4_Backprop_DeepLearning.pdf",
    fileSize: "2.4 MB",
    generatedAt: "2026-09-13T10:30:00Z",
    pageCount: 28,
    overview: "This lecture covers the mathematical formulation of artificial neural networks, multilayer perceptrons (MLP), forward propagation, activation functions (ReLU, Sigmoid, Softmax), and gradient computation using the chain rule via Backpropagation. It highlights common optimization challenges including vanishing/exploding gradients and learning rate schedules.",
    keyDefinitions: [
      {
        term: "Multilayer Perceptron (MLP)",
        definition: "A class of feedforward artificial neural network consisting of an input layer, one or more hidden layers, and an output layer of non-linearly activating nodes."
      },
      {
        term: "Backpropagation",
        definition: "An efficient algorithm for computing gradients of the loss function with respect to every weight in a deep neural network by recursively applying the chain rule of calculus from output backwards."
      },
      {
        term: "Activation Function",
        definition: "A non-linear mathematical operation applied to the weighted sum of inputs that enables the network to learn non-linear decision boundaries and arbitrary continuous functions."
      },
      {
        term: "Vanishing Gradient Problem",
        definition: "A phenomenon where gradients shrink exponentially as backpropagation proceeds through many layers with saturating activations (e.g. Sigmoid/Tanh), preventing early layers from updating weights."
      }
    ],
    coreConcepts: [
      {
        title: "Forward vs. Backward Propagation",
        points: [
          "Forward Pass: Inputs pass layer-by-layer through affine transformations (Z = W·X + b) followed by non-linear activations (A = g(Z)) until reaching the prediction output and calculating scalar loss L.",
          "Backward Pass: Computes partial derivatives ∂L/∂W and ∂L/∂b recursively from final layer to first layer using stored intermediate activations.",
          "Computational complexity scales linearly O(W) with the number of weights, making deep training computationally tractable."
        ]
      },
      {
        title: "Activation Function Comparison",
        points: [
          "Sigmoid: σ(z) = 1 / (1 + e^-z). Outputs range (0, 1). Susceptible to gradient saturation when |z| is large.",
          "ReLU (Rectified Linear Unit): f(z) = max(0, z). Default choice for hidden layers due to non-saturating positive gradient (derivative = 1 for z > 0) and high computational speed.",
          "Leaky ReLU: f(z) = max(αz, z) with α ≈ 0.01 to mitigate the 'dying ReLU' issue where neurons output zero permanently."
        ]
      },
      {
        title: "Stochastic Gradient Descent (SGD) & Momentum",
        points: [
          "Batch vs Mini-batch SGD: Mini-batches (32 to 256 samples) balance vectorization efficiency with stochastic gradient variance that helps escape shallow local minima.",
          "Momentum incorporates an exponential moving average of past gradients: v_t = γ·v_{t-1} + η·∇L, dampening oscillations along steep ravines."
        ]
      }
    ],
    formulasAndFacts: [
      {
        label: "Affine Layer Linear Transformation",
        formulaOrFact: "Z^[l] = W^[l] · A^[l-1] + b^[l]",
        explanation: "Where W is the weight matrix of shape (n^[l], n^[l-1]), A^[l-1] is the previous layer activation vector, and b^[l] is the bias vector."
      },
      {
        label: "Output Error Delta (Chain Rule)",
        formulaOrFact: "δ^[l] = (W^[l+1]ᵀ · δ^[l+1]) ⊙ g'^[l](Z^[l])",
        explanation: "Element-wise multiplication (Hadamard product ⊙) between backpropagated error from the subsequent layer and local activation derivative."
      },
      {
        label: "Weight Gradient Calculation",
        formulaOrFact: "∂L / ∂W^[l] = δ^[l] · (A^[l-1])ᵀ",
        explanation: "Gradient used in gradient descent update rule: W^[l] ← W^[l] - η · (∂L / ∂W^[l])."
      }
    ],
    takeaways: [
      "Without non-linear activation functions, any deep multi-layer neural network mathematically collapses into a single linear transformation (W_total = W_k · ... · W_1).",
      "ReLU is preferred over Sigmoid in hidden layers because its derivative is 1 for positive inputs, directly preventing vanishing gradients.",
      "Backpropagation requires caching intermediate activations Z and A during the forward pass in memory to compute gradients during the backward pass.",
      "Proper weight initialization (He initialization for ReLU, Xavier/Glorot for Tanh) is critical to preserve activation variance across deep layers."
    ],
    practiceQuiz: [
      {
        id: 1,
        question: "Why do deep neural networks require non-linear activation functions between hidden layers?",
        options: [
          "To keep the weights from becoming negative during gradient updates",
          "Without non-linearities, a multi-layer network mathematically collapses into a single linear transformation",
          "To automatically normalize inputs between 0 and 1 before the loss function",
          "Because backpropagation cannot compute derivatives of linear functions"
        ],
        correctAnswer: 1,
        explanation: "The composition of linear functions is always another linear function (e.g. W2*(W1*x) = (W2*W1)*x). Without non-linear activations, adding hidden layers provides no additional expressive power beyond a single linear model."
      },
      {
        id: 2,
        question: "Which activation function is most vulnerable to the vanishing gradient problem when inputs are large positive or negative numbers?",
        options: [
          "Rectified Linear Unit (ReLU)",
          "Leaky ReLU",
          "Sigmoid",
          "ELU (Exponential Linear Unit)"
        ],
        correctAnswer: 2,
        explanation: "The Sigmoid function saturates near 0 (for large negative values) and near 1 (for large positive values). In these saturation regions, its derivative approaches zero (σ'(z) = σ(z)(1 - σ(z)) ≈ 0), causing gradients to vanish across layers."
      },
      {
        id: 3,
        question: "What is stored during the forward pass that is strictly required to execute the backward pass in Backpropagation?",
        options: [
          "Only the final loss value L and target labels y",
          "Intermediate pre-activations Z^[l] and post-activations A^[l-1] for each layer",
          "Future optimizer moments like Adam v_t and m_t",
          "The inverse of the weight matrices W^(-1)"
        ],
        correctAnswer: 1,
        explanation: "Computing ∂L/∂W^[l] = δ^[l] · (A^[l-1])ᵀ and δ^[l] = (W^[l+1]ᵀ · δ^[l+1]) ⊙ g'(Z^[l]) requires both the pre-activations Z^[l] to evaluate g' and previous activations A^[l-1]."
      },
      {
        id: 4,
        question: "How does the computational complexity of computing gradients via Backpropagation compare to a single forward pass?",
        options: [
          "It is exponential O(2^W) relative to the number of weights",
          "It is quadratic O(W^2) due to matrix inversions",
          "It is approximately the same order of magnitude O(W) (roughly 2× the FLOPs of the forward pass)",
          "It is logarithmic O(log W) due to memoization"
        ],
        correctAnswer: 2,
        explanation: "Backpropagation is remarkably efficient: computing all gradients takes roughly 2× the floating-point operations of a single forward evaluation, scaling linearly O(W) with the number of network parameters."
      },
      {
        id: 5,
        question: "What primary advantage does He (Kaiming) weight initialization offer when training deep networks with ReLU activations?",
        options: [
          "It forces all weights to be positive integers",
          "It maintains the variance of activations and gradients across deep layers by scaling variance with 2/n_in",
          "It guarantees the loss function is strictly convex",
          "It eliminates the need to calculate bias gradients"
        ],
        correctAnswer: 1,
        explanation: "He initialization samples weights from N(0, 2/n_in). The factor of 2 accounts for ReLU zeroing out half of the inputs on average, preserving signal variance through dozens of layers without vanishing or exploding."
      }
    ]
  },

  bio: {
    id: "bio-cellular-respiration",
    subject: "Biology / Biochemistry",
    lectureTitle: "Cellular Respiration & ATP Synthesis",
    fileName: "BIO110_Lecture6_Cellular_Respiration.pdf",
    fileSize: "3.1 MB",
    generatedAt: "2026-09-13T10:30:00Z",
    pageCount: 32,
    overview: "This lecture breaks down the four core stages of aerobic cellular respiration: Glycolysis, Pyruvate Oxidation, the Citric Acid (Krebs) Cycle, and Oxidative Phosphorylation. It focuses on the role of electron carriers (NADH, FADH2), proton gradient generation across the inner mitochondrial membrane, and ATP synthase mechanics (chemiosmosis).",
    keyDefinitions: [
      {
        term: "Glycolysis",
        definition: "A ten-step anaerobic metabolic pathway occurring in the cytoplasm that converts 1 glucose molecule into 2 pyruvate molecules, producing a net 2 ATP and 2 NADH."
      },
      {
        term: "Chemiosmosis",
        definition: "The movement of hydrogen ions (protons) across a semipermeable mitochondrial membrane down their electrochemical gradient to drive the mechanical rotation of ATP synthase."
      },
      {
        term: "Oxidative Phosphorylation",
        definition: "The metabolic pathway consisting of the electron transport chain (ETC) and ATP synthase that produces the majority of ATP (~26-28 ATP) in aerobic respiration."
      },
      {
        term: "Terminal Electron Acceptor",
        definition: "Molecular oxygen (O2), which accepts electrons at Complex IV of the ETC and combines with protons to form metabolic water (H2O)."
      }
    ],
    coreConcepts: [
      {
        title: "The Four Stages of Cellular Respiration",
        points: [
          "Stage 1: Glycolysis (Cytoplasm) - Glucose (6C) → 2 Pyruvate (3C). Yields net 2 ATP via substrate-level phosphorylation and 2 NADH. Does not require oxygen.",
          "Stage 2: Pyruvate Oxidation (Mitochondrial Matrix) - 2 Pyruvate → 2 Acetyl-CoA + 2 CO2 + 2 NADH.",
          "Stage 3: Citric Acid Cycle (Mitochondrial Matrix) - 2 Acetyl-CoA yield 4 CO2, 6 NADH, 2 FADH2, and 2 ATP/GTP.",
          "Stage 4: Oxidative Phosphorylation (Inner Mitochondrial Membrane) - High-energy electrons from NADH/FADH2 power proton pumping; ATP synthase synthesizes ~28 ATP."
        ]
      },
      {
        title: "The Proton Motive Force (PMF)",
        points: [
          "Complexes I, III, and IV pump H+ from the mitochondrial matrix into the intermembrane space.",
          "This generates both an electrical gradient (voltage across membrane) and a chemical gradient (pH difference), termed the Proton Motive Force.",
          "Inner membrane is strictly impermeable to H+ except through the catalytic channel of ATP Synthase (F0-F1 complex)."
        ]
      }
    ],
    formulasAndFacts: [
      {
        label: "Overall Chemical Equation",
        formulaOrFact: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30-32 ATP + Heat",
        explanation: "Combustion of one mole of glucose yields carbon dioxide, water, and metabolic energy stored as ATP."
      },
      {
        label: "Net ATP Yield per Glucose Molecule",
        formulaOrFact: "Glycolysis (2) + Krebs (2) + Oxidative Phosphorylation (~26-28) ≈ 30-32 Total ATP",
        explanation: "NADH yields ~2.5 ATP per molecule; FADH2 yields ~1.5 ATP due to entering at Complex II rather than Complex I."
      }
    ],
    takeaways: [
      "Glycolysis is the only stage of cellular respiration that occurs outside the mitochondria and does not require oxygen.",
      "Oxygen is strictly required in aerobic respiration as the terminal electron acceptor; without it, the ETC stalls and NADH cannot be re-oxidized to NAD+.",
      "Most ATP is made by oxidative phosphorylation (chemiosmosis), NOT by substrate-level phosphorylation.",
      "Uncoupling proteins (such as thermogenin in brown adipose tissue) dissipate the proton gradient as heat instead of ATP synthesis."
    ],
    practiceQuiz: [
      {
        id: 1,
        question: "Where in a eukaryotic cell does glycolysis take place?",
        options: [
          "Mitochondrial matrix",
          "Inner mitochondrial membrane",
          "Cytoplasm (Cytosol)",
          "Intermembrane space"
        ],
        correctAnswer: 2,
        explanation: "Glycolysis takes place in the cytosol/cytoplasm. The resulting pyruvate molecules are then actively transported into the mitochondrial matrix for subsequent stages."
      },
      {
        id: 2,
        question: "What is the primary biological role of oxygen (O2) in aerobic cellular respiration?",
        options: [
          "To act as the final electron acceptor at the end of the electron transport chain",
          "To directly split glucose into two 3-carbon pyruvate molecules during glycolysis",
          "To synthesize ATP by phosphorylating ADP in the mitochondrial matrix",
          "To transfer carbon atoms out of the Krebs cycle as carbon dioxide"
        ],
        correctAnswer: 0,
        explanation: "Oxygen has high electronegativity and serves as the terminal electron acceptor at Complex IV, combining with electrons and free protons (H+) to produce water (H2O)."
      },
      {
        id: 3,
        question: "Why does 1 molecule of FADH2 yield fewer ATPs (~1.5 ATP) than 1 molecule of NADH (~2.5 ATP)?",
        options: [
          "FADH2 cannot cross the outer mitochondrial membrane",
          "FADH2 enters the electron transport chain at Complex II, bypassing the proton-pumping Complex I",
          "FADH2 only transfers one single electron instead of two",
          "FADH2 is degraded inside the cytoplasm before reaching ATP synthase"
        ],
        correctAnswer: 1,
        explanation: "Electrons from NADH enter at Complex I, which pumps protons. Electrons from FADH2 enter at Complex II, which does not pump protons across the membrane, resulting in fewer total protons pumped."
      },
      {
        id: 4,
        question: "What directly drives the rotation of the catalytic F1 unit of ATP Synthase during chemiosmosis?",
        options: [
          "Direct hydrolysis of GTP molecules in the matrix",
          "The electrochemical flow of H+ (protons) down their concentration gradient through the F0 channel",
          "Active sodium-potassium ATPase pump action",
          "Direct covalent bonding with carbon dioxide gas"
        ],
        correctAnswer: 1,
        explanation: "Protons in the intermembrane space flow down their electrochemical gradient through the rotor ring of the F0 subunit of ATP synthase back into the matrix, causing conformational rotation that binds ADP and Pi to form ATP."
      },
      {
        id: 5,
        question: "If a chemical inhibitor prevents the Citric Acid Cycle from functioning, what direct consequence occurs to the Electron Transport Chain?",
        options: [
          "The ETC will speed up to compensate for lost ATP",
          "The ETC will run out of electron donors (NADH and FADH2) and eventually stop pumping protons",
          "The ETC will begin using glucose directly as an electron source",
          "The inner mitochondrial membrane will instantly become permeable to all ions"
        ],
        correctAnswer: 1,
        explanation: "The Citric Acid Cycle is the main producer of NADH (6 per glucose) and FADH2 (2 per glucose). Without these reduced electron carriers, the electron transport chain runs out of electrons to transfer, shutting down proton pumping."
      }
    ]
  },

  econ: {
    id: "econ-monetary-policy",
    subject: "Economics / Macroeconomics",
    lectureTitle: "Inflation, Central Banking & Monetary Policy",
    fileName: "ECON201_Lecture8_Monetary_Policy_Inflation.pdf",
    fileSize: "1.9 MB",
    generatedAt: "2026-09-13T10:30:00Z",
    pageCount: 24,
    overview: "This lecture explores the causes of inflation (demand-pull vs cost-push), the Quantity Theory of Money, and how central banks utilize monetary policy instruments (interest rates, reserve requirements, and open market operations) to stabilize the macroeconomy and target price stability along the Phillips Curve.",
    keyDefinitions: [
      {
        term: "Demand-Pull Inflation",
        definition: "Inflation that occurs when aggregate demand for goods and services in an economy exceeds aggregate supply ('too much money chasing too few goods')."
      },
      {
        term: "Cost-Push Inflation",
        definition: "Inflation caused by substantial increases in the cost of important goods or services (e.g. oil price shocks) where no suitable alternative exists, shifting short-run aggregate supply (SRAS) left."
      },
      {
        term: "Open Market Operations (OMO)",
        definition: "The buying and selling of government bonds by a central bank in the open market to expand or contract the amount of reserves in the commercial banking system."
      },
      {
        term: "Phillips Curve",
        definition: "An economic concept showing an inverse short-run relationship between unemployment and inflation, though this trade-off breaks down in the long run (vertical LRPC)."
      }
    ],
    coreConcepts: [
      {
        title: "The Quantity Theory of Money (Equation of Exchange)",
        points: [
          "Expressed as M · V = P · Y, where M = Money Supply, V = Velocity of Money, P = Price Level, and Y = Real GDP / Output.",
          "Under classical assumptions where V and Y are relatively stable in the long run, growth in the money supply (M) translates directly into proportional increases in the price level (P)."
        ]
      },
      {
        title: "Expansionary vs. Contractionary Monetary Policy",
        points: [
          "Expansionary (Dovish): Central bank lowers policy rate / buys securities → Commercial bank reserves increase → Borrowing costs drop → Investment & consumption rise.",
          "Contractionary (Hawkish): Central bank raises policy rate / sells securities → Commercial bank borrowing becomes expensive → Cooling aggregate demand and reining in inflation."
        ]
      }
    ],
    formulasAndFacts: [
      {
        label: "The Equation of Exchange",
        formulaOrFact: "M · V = P · Y",
        explanation: "M = Money Stock, V = Velocity of Money, P = Price Index, Y = Real National Output."
      },
      {
        label: "The Taylor Rule Guideline",
        formulaOrFact: "i = r* + π + 0.5(π - π*) + 0.5(y - y*)",
        explanation: "Prescribes target nominal interest rate (i) based on equilibrium real rate (r*), actual inflation (π), inflation target (π*), and output gap (y - y*)."
      }
    ],
    takeaways: [
      "In the long run, inflation is fundamentally a monetary phenomenon determined by the rate of money supply growth relative to real economic output.",
      "The short-run Phillips curve trade-off between inflation and unemployment disappears in the long run when inflation expectations adjust.",
      "Central banks raise interest rates to slow inflation by cooling aggregate demand, which increases the cost of borrowing for both businesses and households.",
      "Stagflation occurs when cost-push shocks cause simultaneous high inflation, stagnant growth, and high unemployment, defying traditional demand-side interventions."
    ],
    practiceQuiz: [
      {
        id: 1,
        question: "In the Equation of Exchange (M · V = P · Y), what does the variable 'V' represent?",
        options: [
          "Variance of nominal interest rates",
          "Velocity of money (rate at which currency changes hands)",
          "Volume of international exports",
          "Volatility of equity stock prices"
        ],
        correctAnswer: 1,
        explanation: "In M·V = P·Y, V represents the velocity of money—the average number of times per year a single unit of currency is spent on purchasing final goods and services."
      },
      {
        id: 2,
        question: "When a central bank sells government securities in Open Market Operations (OMO), what is the direct effect on the banking system?",
        options: [
          "Bank reserves decrease and short-term interest rates face upward pressure",
          "Bank reserves increase and commercial banks lower lending rates immediately",
          "The federal national debt is instantly cancelled",
          "The statutory reserve requirement ratio is legally doubled"
        ],
        correctAnswer: 0,
        explanation: "When the central bank sells bonds, financial institutions pay for them with reserve balances. This drains liquidity and reserves from the banking system, increasing interbank borrowing rates (tightening policy)."
      },
      {
        id: 3,
        question: "What macroeconomic condition is characterized by stagnant economic growth, high unemployment, and high inflation occurring simultaneously?",
        options: [
          "Hyper-deflation",
          "Stagflation",
          "Liquidity Trap",
          "Monetary Neutrality"
        ],
        correctAnswer: 1,
        explanation: "Stagflation (stagnation + inflation) is typically triggered by negative supply shocks (e.g. 1970s oil crises) that shift short-run aggregate supply leftward, depressing output while raising prices."
      },
      {
        id: 4,
        question: "According to modern macroeconomic theory, what shape does the Long-Run Phillips Curve (LRPC) take?",
        options: [
          "A downward-sloping curve indicating a permanent trade-off",
          "A vertical line at the Natural Rate of Unemployment (NAIRU)",
          "A horizontal line at the central bank's inflation target",
          "An exponential upward-sloping parabola"
        ],
        correctAnswer: 1,
        explanation: "In the long run, expected inflation catches up to actual inflation, meaning monetary policy cannot permanently keep unemployment below the natural rate (NAIRU). Hence, the LRPC is vertical."
      },
      {
        id: 5,
        question: "Which of the following is an example of Cost-Push inflation?",
        options: [
          "A consumer spending boom driven by sudden post-pandemic stimulus checks",
          "A rapid surge in global crude oil prices increasing transportation and manufacturing costs worldwide",
          "Extremely low mortgage rates sparking competitive home bidding wars",
          "A surge in export demand from overseas trading partners"
        ],
        correctAnswer: 1,
        explanation: "Cost-push inflation occurs when production input costs escalate (such as energy or raw materials), shifting the aggregate supply curve leftward and forcing prices up regardless of aggregate demand."
      }
    ]
  }
};
