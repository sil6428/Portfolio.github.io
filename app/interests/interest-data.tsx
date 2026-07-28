import type { InterestDetailData } from "./interest-detail";

export const badmintonData: InterestDetailData = {
  index: "01",
  title: "Badminton",
  label: "Regional competitor · Singles and doubles",
  summary:
    "The sport taught me to make quick decisions, control my movement, and keep working through small improvements.",
  visual: (
    <div className="court-visual" aria-hidden="true">
      <div className="court-lines"><i /><i /><i /><i /></div>
      <div className="shuttle"><span /><b /></div>
      <small>MATCH POINT</small>
    </div>
  ),
  facts: [
    ["Level", "Regional competition"],
    ["Formats", "Singles and doubles"],
    ["Status", "Still playing"],
    ["Focus", "Movement, timing, decision-making"],
  ],
  sections: [
    {
      title: "Competing at regionals",
      paragraphs: [
        "Reaching regional competition gave me a clear measure of how much detail matters. A small change in positioning, timing, or shot choice affects the entire rally.",
        "Matches also taught me to stay composed when momentum shifts. There is little time to dwell on the last point because the next serve starts immediately.",
      ],
    },
    {
      title: "What the sport taught me",
      paragraphs: [
        "Badminton made patience practical. Improvement comes from repeating footwork, reading patterns, and correcting small habits until they hold up under pressure.",
      ],
      bullets: [
        "Watch an opponent's positioning before choosing a shot",
        "Recover to a useful position after every movement",
        "Adjust during a match instead of waiting until it ends",
        "Keep effort consistent when a game becomes difficult",
      ],
    },
    {
      title: "Why I still play",
      paragraphs: [
        "I like the speed, but I keep coming back for the problem-solving. Every opponent creates a different match, and every rally gives immediate feedback.",
      ],
    },
  ],
  nextSlug: "3d-printing",
  nextTitle: "3D printing",
};

export const printingData: InterestDetailData = {
  index: "02",
  title: "3D printing & design",
  label: "From digital model to physical object",
  summary:
    "I enjoy turning files into physical builds, then solving the scaling, tolerance, assembly, and finishing problems along the way.",
  visual: (
    <div className="printer-visual" aria-hidden="true">
      <div className="printer-frame"><span className="printer-head" /><i className="print-bed" /><b className="print-model" /></div>
      <div className="layer-readout">LAYER <strong>284</strong><span /></div>
    </div>
  ),
  facts: [
    ["Process", "Model, slice, print, assemble, finish"],
    ["Large build", "Elden Ring-inspired katana"],
    ["Prop build", "Replica hand cannon"],
    ["Focus", "Scale, tolerances, and finishing"],
  ],
  sections: [
    {
      title: "From a file to a finished piece",
      paragraphs: [
        "Printing is only one stage. Before a build starts, I need to check scale, orientation, supports, and how separate parts will connect. After printing, the work moves to fitting, sanding, assembly, and finishing.",
        "That full process is what interests me. A digital model looks complete, but the physical version exposes every weak measurement and awkward connection.",
      ],
    },
    {
      title: "The larger builds",
      paragraphs: [
        "My larger projects include a katana inspired by Elden Ring and a replica hand cannon. Both required the designs to be divided into printable pieces and assembled into a convincing final form.",
      ],
      bullets: [
        "Scale pieces so they fit the printer and the finished prop",
        "Plan joints before committing to a long print",
        "Test tolerances with smaller samples",
        "Use sanding and finishing to hide layer lines and seams",
      ],
    },
    {
      title: "Why I like the process",
      paragraphs: [
        "3D printing gives me a direct loop between design and evidence. If an idea does not work, the physical part shows why. I adjust the file, print again, and compare the result.",
      ],
    },
  ],
  nextSlug: "reading",
  nextTitle: "Reading",
};

export const readingData: InterestDetailData = {
  index: "03",
  title: "Web novels, manhwa & manga",
  label: "Long stories and detailed worlds",
  summary:
    "I like stories that take their time, build consistent rules, and make small details matter hundreds of chapters later.",
  visual: (
    <div className="books-visual" aria-hidden="true">
      <div className="book book-one"><small>01</small><strong>LORD OF THE<br />MYSTERIES</strong><span>IN PROGRESS</span></div>
      <div className="book book-two"><small>02</small><strong>REVEREND<br />INSANITY</strong><span>IN PROGRESS</span></div>
      <div className="page-count">BOOKMARK / 2026</div>
    </div>
  ),
  facts: [
    ["Currently reading", "Lord of the Mysteries"],
    ["Also reading", "Reverend Insanity"],
    ["Formats", "Web novels, manhwa, manga"],
    ["Preference", "Dense worlds and patient development"],
  ],
  sections: [
    {
      title: "What I am reading",
      paragraphs: [
        "I am currently working through Lord of the Mysteries and Reverend Insanity. Both are long-form stories with enough room to establish detailed worlds, competing motivations, and consequences that build over time.",
      ],
    },
    {
      title: "What keeps me interested",
      paragraphs: [
        "I pay attention to how a story establishes its rules and whether later events respect them. I also like character development that happens through choices and consequences instead of quick explanations.",
      ],
      bullets: [
        "Worldbuilding with consistent internal rules",
        "Long-term character development",
        "Early details that become important later",
        "Conflicts without simple answers",
      ],
    },
    {
      title: "Why long stories work for me",
      paragraphs: [
        "A long story has space to let ideas develop. When the pacing is patient, the payoff feels earned because I have spent enough time understanding the people and the world involved.",
      ],
    },
  ],
  nextSlug: "photography",
  nextTitle: "Photography",
};

export const photographyData: InterestDetailData = {
  index: "04",
  title: "Photography",
  label: "Light, colour, and everyday scenes",
  summary:
    "Photography gives me a reason to notice ordinary scenes, strong light, and details I would otherwise walk past.",
  visual: (
    <div className="photo-visual" aria-hidden="true">
      <div className="photo-frame photo-a"><span>01</span></div>
      <div className="photo-frame photo-b"><span>02</span></div>
      <div className="photo-frame photo-c"><span>03</span></div>
      <small>CONTACT SHEET / IN PROGRESS</small>
    </div>
  ),
  facts: [
    ["Subjects", "Street details and everyday moments"],
    ["Style", "Simple edits and strong colour"],
    ["Gallery", "VSCO"],
    ["Status", "Ongoing"],
  ],
  links: [{ label: "View my VSCO", href: "https://sy1len.vsco.site" }],
  sections: [
    {
      title: "What I look for",
      paragraphs: [
        "I am drawn to scenes with clear light, strong colour, or one detail that changes the frame. Most of the photographs start with something small that makes me stop walking.",
      ],
      bullets: [
        "Light falling across ordinary spaces",
        "Colour combinations that hold a frame together",
        "Street details people usually pass",
        "Simple compositions without heavy editing",
      ],
    },
    {
      title: "How I approach editing",
      paragraphs: [
        "I prefer edits that support what was already present. The goal is to keep the scene recognizable while making the light, colour, and framing feel intentional.",
      ],
    },
    {
      title: "A visual record",
      paragraphs: [
        "Over time, the photos become a record of what caught my attention. The gallery is less about a fixed theme and more about the way I notice places and moments.",
      ],
    },
  ],
  nextSlug: "home-lab",
  nextTitle: "Home lab",
};

export const homeLabData: InterestDetailData = {
  index: "05",
  title: "The Proxmox home lab",
  label: "Old hardware, new jobs",
  summary:
    "I am turning older computers into a small server environment where I can test virtualization and networking through direct use.",
  visual: (
    <div className="rack-visual" aria-hidden="true">
      <div className="rack-unit"><span>NODE 01</span><i /><i /><b>ONLINE</b></div>
      <div className="rack-unit"><span>NODE 02</span><i /><i /><b>BUILDING</b></div>
      <div className="rack-unit"><span>STORAGE</span><i /><i /><b>READY</b></div>
      <div className="rack-footer"><span /> PROXMOX VE / HOME LAB</div>
    </div>
  ),
  facts: [
    ["Platform", "Proxmox VE"],
    ["Hardware", "Repurposed computers"],
    ["Focus", "Virtualization and networking"],
    ["Status", "Current build"],
  ],
  sections: [
    {
      title: "Why reuse old computers",
      paragraphs: [
        "The project started because I wanted practical experience with virtualization and already had older hardware available. Reusing it gives each machine a purpose and gives me room to experiment without treating every mistake as a disaster.",
      ],
    },
    {
      title: "What I am building",
      paragraphs: [
        "The goal is a small environment for virtual machines, separated services, networking tests, and resource monitoring. I am learning the setup by operating it, documenting problems, and rebuilding parts when the first approach does not work.",
      ],
      bullets: [
        "Create and manage virtual machines",
        "Separate services and test network boundaries",
        "Monitor storage, memory, and processor use",
        "Find useful jobs for hardware that would otherwise sit unused",
      ],
    },
    {
      title: "Why it is useful",
      paragraphs: [
        "The home lab turns networking and systems concepts into something concrete. Instead of only reading about a configuration, I can deploy it, break it, observe the result, and repair it.",
      ],
    },
  ],
  nextSlug: "badminton",
  nextTitle: "Badminton",
};
