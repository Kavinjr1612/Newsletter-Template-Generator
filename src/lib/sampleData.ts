import { Edition, createEdition } from '@/types/newspaper';

export function createSampleEdition(): Edition {
  const edition = createEdition('KEC Chronicle — Spring 2026', 'Department of Computer Science and Engineering');

  edition.editionNumber = 7;
  edition.tagline = 'Innovate · Inspire · Impact';
  edition.collegeName = 'Kongu Engineering College';
  edition.collegeLocation = 'Perundurai, Erode – 638 060';
  edition.collegeLogoUrl = 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&h=120&fit=crop';
  edition.logoUrl = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&h=120&fit=crop';
  edition.buildingPhotoUrl = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop';
  edition.templateStyle = 'academic-institutional';

  edition.visionMission = {
    institutionVision: 'To be a globally recognized institution of excellence in engineering education and research, fostering innovation and producing industry-ready graduates who contribute meaningfully to society.',
    institutionMission: 'To provide quality technical education through state-of-the-art infrastructure, experienced faculty, and industry collaboration. To nurture creativity, ethical values, and leadership among students while promoting research that addresses real-world challenges.',
    deptVision: 'To be a center of excellence in Computer Science and Engineering, producing skilled professionals who drive technological innovation and digital transformation across industries.',
    deptMission: 'To impart quality education in computer science fundamentals and emerging technologies. To foster a research-oriented environment and develop professionals with strong ethical values, communication skills, and a commitment to lifelong learning.',
    programOutcomes: [
      'Engineering Knowledge: Apply knowledge of mathematics, science, engineering fundamentals, and Computer Science specialization to solve complex engineering problems.',
      'Problem Analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions.',
      'Design & Development: Design solutions for complex engineering problems and design system components or processes that meet specified needs with consideration for public health, safety, and environment.',
      'Conduct Investigations: Use research-based knowledge and methods including design of experiments, analysis and interpretation of data to provide valid conclusions.',
      'Modern Tool Usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools to complex engineering activities with an understanding of limitations.',
      'Engineer and Society: Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal, and cultural issues and the consequent responsibilities relevant to professional practice.',
      'Environment and Sustainability: Understand the impact of professional engineering solutions in societal and environmental contexts and demonstrate knowledge of sustainable development.',
      'Ethics: Apply ethical principles and commit to professional ethics, responsibilities, and norms of engineering practice.',
      'Individual and Team Work: Function effectively as an individual and as a member or leader in diverse teams and in multidisciplinary settings.',
      'Communication: Communicate effectively on complex engineering activities with the engineering community and society at large.',
      'Project Management and Finance: Demonstrate knowledge and understanding of engineering and management principles and apply these to one\'s own work, as a member and leader in a team.',
      'Life-long Learning: Recognize the need for and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.',
    ],
    peos: [
      'PEO 1: Graduates will have successful careers in industry, academia, government, or entrepreneurial pursuits in the field of Computer Science and Engineering.',
      'PEO 2: Graduates will engage in lifelong learning and professional development to adapt to evolving technologies and contribute to the advancement of their profession.',
      'PEO 3: Graduates will demonstrate leadership, teamwork, and effective communication skills in their professional careers while upholding ethical standards.',
    ],
    psos: [
      'PSO 1: Ability to apply software engineering principles and practices for developing quality software for scientific and business applications.',
      'PSO 2: Ability to design and develop intelligent systems using modern computing platforms, machine learning, and data analytics techniques.',
    ],
    institutionImageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop',
    deptImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
  };

  edition.hodMessage = {
    name: 'Dr. S. Ramesh Kumar',
    title: 'Head of Department – CSE',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    message: 'It gives me immense pleasure to present the seventh edition of our department newsletter. This edition showcases the remarkable achievements of our students and faculty in academics, research, and extracurricular activities. Our department continues to grow in reputation and excellence, with significant contributions to cutting-edge research in AI, cybersecurity, and cloud computing. I congratulate the editorial team for their tireless efforts in bringing this edition to life.',
  };

  edition.facultyMessage = {
    name: 'Dr. Priya Dharshini',
    title: 'Associate Professor & Newsletter Coordinator',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    message: 'The CSE department has achieved new milestones this semester with 15 research papers published in Scopus-indexed journals, 3 patents filed, and multiple national-level hackathon victories. Our students have secured internships at top tech companies and our placement record continues to be outstanding. This newsletter captures the spirit of innovation that defines our department.',
  };

  edition.studentMessage = {
    name: 'Arun Vijay K.',
    title: 'Student Editor – Final Year CSE',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    message: 'Being part of the editorial team has been a wonderful journey. This edition brings you stories of inspiration — from our seniors who cracked dream placements to juniors who built award-winning projects. We have also featured faculty research highlights and campus life snapshots. I hope this newsletter motivates every student to dream big and work hard.',
  };

  edition.articles = [
    {
      id: crypto.randomUUID(),
      title: 'AI-Powered Smart Campus: Students Build IoT Monitoring System',
      author: 'Kavitha S., III Year CSE',
      category: 'research',
      body: 'A team of third-year students has developed an innovative IoT-based smart campus monitoring system that uses AI to optimize energy consumption across college buildings. The system employs TensorFlow Lite models on Raspberry Pi devices to predict occupancy patterns and automatically adjust lighting and HVAC systems. The project, which won first place at the National Innovation Challenge held at IIT Madras, has reduced energy consumption by 23% in the pilot wing. The team plans to expand the system to cover the entire campus by next semester, with integration into the college ERP system for centralized monitoring.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      sourceUrl: '',
      priority: 'headline',
      isUrgent: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Blockchain-Based Certificate Verification System Launched',
      author: 'Dr. M. Karthikeyan, Assistant Professor',
      category: 'academics',
      body: 'The department has launched a blockchain-based certificate verification system that ensures tamper-proof academic credentials for all graduates. Built on Ethereum smart contracts and IPFS storage, the system allows employers to instantly verify the authenticity of degrees and transcripts. This initiative positions KEC as one of the first engineering colleges in Tamil Nadu to adopt blockchain technology for academic administration. The project was developed as part of a faculty-student collaborative research initiative funded by AICTE.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      sourceUrl: '',
      priority: 'feature',
      isUrgent: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Students Win National Cybersecurity Hackathon',
      author: 'Deepak R., IV Year CSE',
      category: 'achievements',
      body: 'A team of four CSE students secured first place at the CyberShield 2026 national hackathon organized by NASSCOM, competing against 200+ teams from premier institutions. Their solution involved a real-time threat detection system using federated learning, which impressed the judges with its novel approach to privacy-preserving security analytics. The team received a cash prize of ₹2,00,000 and internship offers from leading cybersecurity firms.',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
      sourceUrl: '',
      priority: 'feature',
      isUrgent: false,
      createdAt: new Date().toISOString(),
    },
  ];

  edition.placements = [
    {
      id: crypto.randomUUID(),
      companyName: 'Google',
      lpa: '32 LPA',
      companyLogoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
      students: [
        { name: 'Rahul Krishnan', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
        { name: 'Sneha Lakshmi', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
      ],
    },
    {
      id: crypto.randomUUID(),
      companyName: 'Microsoft',
      lpa: '42 LPA',
      companyLogoUrl: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop',
      students: [
        { name: 'Aravind M.', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
        { name: 'Divya Bharathi', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { name: 'Karthik R.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
      ],
    },
    {
      id: crypto.randomUUID(),
      companyName: 'Amazon',
      lpa: '28 LPA',
      companyLogoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop',
      students: [
        { name: 'Pradeep S.', photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face' },
        { name: 'Meera Nair', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
      ],
    },
  ];

  edition.publications = [
    {
      id: crypto.randomUUID(),
      dept: 'CSE',
      paperDetails: 'Deep Learning-Based Anomaly Detection in Network Traffic Using Transformer Architecture — Published in IEEE Transactions on Neural Networks, Vol. 37, 2026',
      claimingAuthor: 'Dr. S. Ramesh Kumar & Kavitha S.',
      indexing: 'SCI / Scopus',
    },
    {
      id: crypto.randomUUID(),
      dept: 'CSE',
      paperDetails: 'A Novel Approach to Federated Learning for Privacy-Preserving Healthcare Data Analysis — Springer LNCS, 2026',
      claimingAuthor: 'Dr. Priya Dharshini & Deepak R.',
      indexing: 'Scopus',
    },
    {
      id: crypto.randomUUID(),
      dept: 'CSE',
      paperDetails: 'Optimizing Cloud Resource Allocation Using Multi-Objective Genetic Algorithms — Elsevier Journal of Cloud Computing, 2025',
      claimingAuthor: 'Dr. M. Karthikeyan',
      indexing: 'SCI',
    },
  ];

  edition.editorialTeam = {
    facultyAdvisor: {
      name: 'Dr. Priya Dharshini',
      title: 'Associate Professor & Newsletter Coordinator',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    },
    members: [
      { name: 'Arun Vijay K.', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
      { name: 'Nithya Shree R.', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
      { name: 'Surya Prakash M.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
      { name: 'Anitha B.', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    ],
  };

  return edition;
}
