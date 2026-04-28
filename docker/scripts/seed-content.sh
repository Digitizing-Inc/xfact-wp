#!/bin/sh
# Page Content Seeder for xFact WordPress Theme.
#
# Removes default content, creates pages, sets static front page,
# and populates each page's post_content with the appropriate block markup.
# Called by setup.sh.
#
# Usage: sh seed-content.sh

set -eu

echo "📝 Seeding page content..."

: "${WP_SITE_URL:?missing}"

# Theme assets base URL — used for image attributes.
SITE_URL=$(wp option get siteurl 2>/dev/null || echo "$WP_SITE_URL")
ASSETS="${SITE_URL}/wp-content/themes/xfact/assets/images"

# Remove default content
echo "🧹 Cleaning up default content..."
wp post delete 1 --force 2>/dev/null || true    # Hello World
wp post delete 2 --force 2>/dev/null || true    # Sample Page
wp comment delete 1 --force 2>/dev/null || true # Default comment

# Create theme pages (slugs must match template filenames: page-{slug}.html)
echo "📄 Creating theme pages..."
for page_info in \
    "Home:home" \
    "About:about" \
    "Capabilities:capabilities" \
    "Solutions:solutions" \
    "Support:support" \
    "Careers:careers" \
    "Contact:contact" \
    "Privacy Policy:privacy" \
    "Terms of Service:terms"; do
    title="${page_info%%:*}"
    slug="${page_info##*:}"
    if ! wp post list --post_type=page --name="$slug" --field=ID 2>/dev/null | grep -q .; then
        wp post create --post_type=page --post_title="$title" --post_name="$slug" --post_status=publish
        echo "  ✅ Created page: $title ($slug)"
    else
        echo "  ✅ Page exists: $title ($slug)"
    fi
done

# Set static front page
FRONT_PAGE_ID=$(wp post list --post_type=page --name=home --field=ID 2>/dev/null)
if [ -n "$FRONT_PAGE_ID" ]; then
    wp option update show_on_front page
    wp option update page_on_front "$FRONT_PAGE_ID"
    echo "  ✅ Front page set to: Home (ID $FRONT_PAGE_ID)"
fi

echo "📝 Adding block markup..."

# ── Home ──────────────────────────────────────────────────────
HOME_ID=$(wp post list --post_type=page --name=home --field=ID 2>/dev/null)
if [ -n "$HOME_ID" ]; then
    wp post update "$HOME_ID" --post_content='<!-- wp:xfact/hero {"align":"full","slides":[{"src":"'"${ASSETS}"'/hero-solutions.jpg","alt":"Healthcare workers collaborating","position":"65% 30%"},{"src":"'"${ASSETS}"'/hero-contact.jpg","alt":"Students using technology","position":"center 35%"},{"src":"'"${ASSETS}"'/hero-careers.jpg","alt":"Volunteers working together","position":"center 30%"},{"src":"'"${ASSETS}"'/hero-support.jpg","alt":"Public safety operations","position":"70% 30%"}],"posterImage":"'"${ASSETS}"'/xfact-hero-poster.png","videoUrl":"'"${ASSETS}"'/xfact-hero.mp4"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Our Promise","heading":"One Partner. Complete Accountability.","body":"Public institutions depend on technology that cannot fail — systems that must remain continuously secure, stable, and available, often across fragmented environments built on legacy infrastructure and multiple vendors. xFact exists to bring those environments together: We integrate, secure, and sustain mission-critical systems under one accountable partnership — so the institutions that serve communities can focus on their mission, not their infrastructure."} /-->

<!-- wp:xfact/solutions-grid {"sectors":[{"title":"Public safety & justice","description":"Law enforcement, courts, corrections, 911 systems","iconName":"Shield","href":"/solutions#public-safety"},{"title":"Government & municipal","description":"State, county, and local agencies","iconName":"Landmark","href":"/solutions#government"},{"title":"Education","description":"K-12 districts and higher education","iconName":"GraduationCap","href":"/solutions#education"},{"title":"Health & human services","description":"Healthcare, behavioral health, social services","iconName":"HeartPulse","href":"/solutions#hhs"},{"title":"Infrastructure & managed services","description":"DataServ, an xFact solution","iconName":"ServerCog","href":"/solutions#infrastructure"}]} /-->

<!-- wp:xfact/capabilities-pipeline /-->

<!-- wp:xfact/metrics-strip {"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"DataServ Integration","heading":"Trusted Services, Expanded Capabilities","badgeText":"● Formerly DataServ","body":"DataServ has delivered managed IT, cloud, and cybersecurity services to K-12 schools, municipalities, and businesses for years. That experience — and the team behind it — is now part of xFact, giving clients access to a wider range of capabilities without changing the relationships they rely on.","tags":[{"label":"Managed IT","iconName":"Monitor"},{"label":"Cloud services","iconName":"Cloud"},{"label":"Cybersecurity","iconName":"ShieldCheck"},{"label":"K-12 schools","iconName":"School"},{"label":"Municipalities","iconName":"Building2"},{"label":"Senior loan \u0026 contacts","iconName":"Users"}]} /-->

<!-- wp:xfact/logo-strip /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to talk about your systems?","subtitle":"Whether you'\''re planning an upgrade, responding to a requirement, or evaluating a long-term partner — we'\''re the right conversation to start.","primaryLabel":"Contact xFact","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Home"
fi

# ── About ─────────────────────────────────────────────────────
ABT_ID=$(wp post list --post_type=page --name=about --field=ID 2>/dev/null)
if [ -n "$ABT_ID" ]; then
    wp post update "$ABT_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"About xFact","heading":"Behind the Systems Communities Rely On","subtitle":"For more than two decades, xFact has partnered with public-sector institutions to design, integrate, secure, and sustain mission-critical technology systems.","align":"full"} /-->

<!-- wp:xfact/text-section {"heading":"Our Story","body":"xFact began as a public-sector technology services firm focused on helping state, local, and education organizations modernize the systems their communities depend on. Over time, that work expanded across infrastructure, cybersecurity, applications, and strategy — and DataServ joined as our infrastructure and managed-services platform. Today, xFact operates as a single accountable partner for the institutions behind public safety, government, education, and human services."} /-->

<!-- wp:xfact/text-section {"heading":"Why We Do It","body":"Public institutions rely on technology systems that must work every day. Many of those environments have evolved across multiple vendors, platforms, and legacy systems — creating fragmentation and operational risk. We exist to bring those environments together: integrated, accountable, and sustained over time so communities receive uninterrupted service."} /-->

<!-- wp:xfact/feature-cards {"sectionLabel":"How We Operate","heading":"Our Values","cards":[{"title":"Long-term accountability","description":"We stay with our clients across the full lifecycle of their systems — from design through ongoing operation.","iconName":"ShieldCheck"},{"title":"One coordinated system","description":"We bring infrastructure, security, applications, and strategy together so environments operate as one — not as a collection of disconnected services.","iconName":"Network"},{"title":"Mission-aligned delivery","description":"Every project we ship supports a public-sector mission. We build for reliability, governance, and the people communities depend on.","iconName":"HeartPulse"},{"title":"Real partnership","description":"We work alongside our clients, not at arm'\''s length. That means clear communication, honest tradeoff conversations, and shared success metrics.","iconName":"Users"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to talk about your systems?","subtitle":"Whether you'\''re planning an upgrade, evaluating a long-term partner, or starting an assessment — we'\''re the right conversation to start.","primaryLabel":"Contact xFact","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: About"
fi

# ── Capabilities ────────────────────────────────────────────────
CAP_ID=$(wp post list --post_type=page --name=capabilities --field=ID 2>/dev/null)
if [ -n "$CAP_ID" ]; then
    wp post update "$CAP_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Capabilities","heading":"Integrated Capabilities for Mission-Critical Systems","subtitle":"Coordinated expertise supporting systems across their full lifecycle — from idea to action, design through long-term operation.","align":"full"} /-->

<!-- wp:xfact/text-section {"heading":"A Full-Funnel Capabilities Stack","body":"Public-sector environments require integrated expertise across infrastructure, security, applications, and strategy. xFact delivers coordinated, system-level solutions that align with governance and operational realities. Support extends from design through long-term operation."} /-->

<!-- wp:xfact/text-section {"sectionIcon":"Compass","useAltBackground":true,"heading":"Strategy \u0026 Advisory","subtitle":"Where it starts: governance-aware strategy and planning that ensure systems evolve responsibly over time.","body":"We help leaders shape technology direction in environments that demand stability, governance, and accountability. Our advisory work translates strategic intent into a practical roadmap that respects budget cycles, procurement rules, and the realities of running essential services.","tags":[{"label":"Technology assessments \u0026 roadmaps"},{"label":"Architecture \u0026 enterprise planning"},{"label":"Governance \u0026 risk strategy"},{"label":"Procurement \u0026 vendor advisory"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"AppWindow","heading":"Applications \u0026 Integration","subtitle":"Connected applications and systems designed to operate reliably as one coordinated environment.","body":"We design, build, and integrate applications that connect across the systems public institutions already rely on. The result is fewer silos, less duplication, and a coordinated environment that scales with the mission.","tags":[{"label":"Custom application development"},{"label":"System integration \u0026 APIs"},{"label":"Workflow \u0026 case-management platforms"},{"label":"Modernization of legacy applications"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"Database","useAltBackground":true,"heading":"Data \u0026 Platforms","subtitle":"Structured, secure data environments that enable visibility, coordination, and informed decision-making.","body":"Our data work focuses on giving leaders a trustworthy picture of their environments. We build platforms that move sensitive data safely, structure it for accountability, and surface it where decisions are made.","tags":[{"label":"Data platform design"},{"label":"Reporting, analytics \u0026 dashboards"},{"label":"Data governance \u0026 lineage"},{"label":"Master data \u0026 integration patterns"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"ShieldCheck","heading":"Cybersecurity","subtitle":"Coordinated protection and monitoring that keeps systems secure without disrupting essential operations.","body":"Security in public-sector environments is a continuous practice, not a project. We design defenses that account for compliance requirements, monitor environments around the clock, and respond when something matters.","tags":[{"label":"Security architecture \u0026 assessments"},{"label":"Compliance (CJIS, HIPAA, FedRAMP, etc.)"},{"label":"24x7 managed detection \u0026 response"},{"label":"Incident response \u0026 recovery"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"ServerCog","useAltBackground":true,"heading":"Infrastructure \u0026 Platform Environments","subtitle":"Resilient environments that ensure mission-critical systems remain secure, stable, and continuously operational.","body":"Our infrastructure practice — delivered through DataServ, an xFact solution — provides the resilient foundation public institutions need to operate essential systems with confidence.","tags":[{"label":"Hybrid \u0026 cloud infrastructure"},{"label":"Hosted platform environments (DataServ)"},{"label":"Network \u0026 telecommunications"},{"label":"Managed services \u0026 monitoring"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Bring it all together.","subtitle":"Talk to us about coordinating your environments under one accountable partner.","primaryLabel":"Start a conversation","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Capabilities"
fi

# ── Solutions ─────────────────────────────────────────────────
SOL_ID=$(wp post list --post_type=page --name=solutions --field=ID 2>/dev/null)
if [ -n "$SOL_ID" ]; then
    wp post update "$SOL_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Solutions","heading":"Reliable Systems. Stronger Communities.","subtitle":"xFact supports mission-critical systems across complex public-sector environments. A single accountable partner improves reliability and reduces complexity.","backgroundImage":"'"${ASSETS}"'/hero-solutions.jpg","imageAlt":"Healthcare workers collaborating","align":"full"} /-->

<!-- wp:xfact/text-section {"anchor":"public-safety","sectionIcon":"Shield","sectionLabel":"Public Safety \u0026 Justice","heading":"Strengthening Systems That Cannot Fail","body":"Public safety agencies operate in environments where technology reliability is critical to real-time operations. Communications infrastructure and secure information environments must remain continuously available while meeting stringent security and compliance requirements. xFact helps public safety organizations maintain resilient and secure technology environments that support mission-critical operations and ensure systems remain dependable in high-consequence situations.","tags":[{"label":"Public Safety Data Broker Solution"},{"label":"License Management System"},{"label":"Cloud Migration Strategic Roadmap"}],"linkText":"Schedule an assessment →","linkUrl":"/contact"} /-->

<!-- wp:xfact/text-section {"anchor":"government","sectionIcon":"Landmark","sectionLabel":"Municipal, State \u0026 Local Government","heading":"Coordinating Systems That Support Communities","body":"State, municipal, and county governments rely on interconnected systems that support essential community services. From public works and administrative operations to digital services and civic infrastructure, these systems must remain secure, resilient, and continuously operational. xFact helps state and local governments strengthen and coordinate these technology environments so departments can operate reliably, manage growing complexity, and sustain the services communities depend on.","tags":[{"label":"Enterprise Risk Management Plan"},{"label":"Hybrid Cloud Data Center Migration"},{"label":"Covid-19 and Collaboration"}],"linkText":"Schedule an assessment →","linkUrl":"/contact"} /-->

<!-- wp:xfact/text-section {"anchor":"education","sectionIcon":"GraduationCap","sectionLabel":"Education","heading":"Supporting Learning Through Reliable Systems","body":"Schools rely on secure and reliable technology environments to support teaching, learning, and student services. From classroom connectivity and instructional platforms to administrative systems and student data, these environments must remain continuously available. xFact helps school systems maintain stable, secure infrastructure that supports educators, protects student data, and enables technology environments to evolve responsibly without disrupting the learning experience.","tags":[{"label":"AI Learning Platform"},{"label":"Network Infrastructure Overhaul"},{"label":"Digital Transformation Consulting"}],"linkText":"Schedule an assessment →","linkUrl":"/contact"} /-->

<!-- wp:xfact/text-section {"anchor":"hhs","sectionIcon":"HeartPulse","sectionLabel":"Health \u0026 Human Services","heading":"Supporting Systems That Serve Communities","body":"Health and human services agencies depend on secure, reliable systems that support care delivery, compliance, and community services. From patient management and clinical systems to eligibility platforms and interagency data exchange, these environments must meet strict regulatory requirements while remaining accessible and operational. xFact helps HHS organizations maintain technology environments that support continuous service delivery, protect sensitive data, and adapt to evolving regulatory and operational demands.","tags":[{"label":"EHR Integration"},{"label":"HIPAA Compliance Infrastructure"},{"label":"Telehealth Platform Migration"}],"linkText":"Schedule an assessment →","linkUrl":"/contact"} /-->

<!-- wp:xfact/text-section {"anchor":"infrastructure","sectionIcon":"ServerCog","sectionLabel":"Infrastructure \u0026 Managed Services","heading":"Resilient Infrastructure for Mission-Critical Systems","badgeText":"● DataServ, an xFact solution","body":"Organizations that rely on always-on technology need infrastructure that is secure, scalable, and continuously monitored. From private and hybrid cloud environments to wide-area networking, endpoint management, and disaster recovery — reliable infrastructure underpins every service. xFact delivers managed infrastructure services that keep systems stable, reduce risk, and allow organizations to focus on operations rather than technology complexity.","tags":[{"label":"Managed IT Services"},{"label":"Hybrid Cloud Infrastructure"},{"label":"24/7 NOC and SOC Monitoring"}],"linkText":"Schedule an assessment →","linkUrl":"/contact"} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Solutions"
fi

# ── Support ───────────────────────────────────────────────────
SUP_ID=$(wp post list --post_type=page --name=support --field=ID 2>/dev/null)
if [ -n "$SUP_ID" ]; then
    wp post update "$SUP_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Support","heading":"Access assistance for your systems and services.","subtitle":"Ongoing support maintains system reliability. Our structured processes enable efficient response and timely issue resolution.","backgroundImage":"'"${ASSETS}"'/hero-support.jpg","imageAlt":"Police officer on duty","align":"full"} /-->

<!-- wp:xfact/support-channels /-->'
    echo "  ✅ Seeded: Support"
fi

# ── Careers ───────────────────────────────────────────────────
CAR_ID=$(wp post list --post_type=page --name=careers --field=ID 2>/dev/null)
if [ -n "$CAR_ID" ]; then
    wp post update "$CAR_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Careers","heading":"Work behind the systems communities rely on.","subtitle":"Join a team that supports mission-critical technology for public-sector organizations. Build systems that must work every day.","backgroundImage":"'"${ASSETS}"'/hero-careers.jpg","imageAlt":"Volunteers working together","align":"full"} /-->

<!-- wp:xfact/feature-cards {"sectionLabel":"Why xFact","heading":"What it means to work here","cards":[{"title":"Mission-Driven Work","description":"Every project supports systems critical to public services — from public safety to education to healthcare.","iconName":"Target"},{"title":"High-Accountability Environments","description":"Our teams operate in environments where reliability matters. The work we do must function every day.","iconName":"ShieldCheck"},{"title":"Real Impact","description":"Employees contribute directly to systems that serve communities and support essential public operations.","iconName":"Zap"},{"title":"Growth \u0026 Development","description":"Work alongside experienced professionals across infrastructure, security, applications, and strategy.","iconName":"TrendingUp"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Interested in joining the team?","subtitle":"We'\''re always looking for talented people who want to do meaningful work.","primaryLabel":"Get in Touch","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Careers"
fi

# ── Contact ───────────────────────────────────────────────────
CON_ID=$(wp post list --post_type=page --name=contact --field=ID 2>/dev/null)
if [ -n "$CON_ID" ]; then
    wp post update "$CON_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Contact","heading":"Start the Conversation","subtitle":"Complex environments require thoughtful evaluation.","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Kids using technology in the classroom","align":"full"} /-->

<!-- wp:xfact/contact-form {"heading":"Get in Touch","subtitle":"Tell us about your organization and what you'\''re looking to accomplish. We'\''ll connect you with the right team."} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Technology Assessment","heading":"Evaluate Your Systems","body":"Our technology assessments help organizations understand their current environment, identify risks and opportunities, and develop a practical roadmap for improvement."} /-->'
    echo "  ✅ Seeded: Contact"
fi

# ── Privacy Policy ────────────────────────────────────────────
PRI_ID=$(wp post list --post_type=page --name=privacy --field=ID 2>/dev/null)
if [ -n "$PRI_ID" ]; then
    wp post update "$PRI_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Legal","heading":"Privacy Policy","subtitle":"Effective date: January 1, 2025","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Privacy and security","align":"full"} /-->

<!-- wp:xfact/section-list {"showNumbers":true,"introText":"xFact (\"we,\" \"us,\" or \"our\") is committed to protecting the privacy of individuals who visit our website and use our services. This Privacy Policy describes how we collect, use, and safeguard your information.","sections":[{"title":"Information We Collect","content":"We collect information you provide directly, such as your name, email address, organization, and message content when you submit a contact form or request an assessment. We also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed."},{"title":"How We Use Your Information","content":"We use the information we collect to respond to your inquiries and requests, provide and improve our services, communicate with you about our offerings, comply with legal obligations, and protect the security and integrity of our website and services."},{"title":"Information Sharing","content":"We do not sell, rent, or trade your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential. We may also disclose information when required by law or to protect our rights."},{"title":"Data Security","content":"We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security."},{"title":"Cookies and Tracking","content":"Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie settings through your browser preferences. Disabling cookies may limit certain functionality of our website."},{"title":"Third-Party Links","content":"Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit."},{"title":"Data Retention","content":"We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements."},{"title":"Your Rights","content":"You may request access to, correction of, or deletion of your personal information by contacting us. We will respond to your request within a reasonable timeframe and in accordance with applicable law."},{"title":"Changes to This Policy","content":"We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after any changes constitutes acceptance of the revised policy."},{"title":"Contact Us","content":"If you have questions about this Privacy Policy or our data practices, please contact us at info@xfact.com or through our contact page."}]} /-->'
    echo "  ✅ Seeded: Privacy"
fi

# ── Terms of Service ──────────────────────────────────────────
TER_ID=$(wp post list --post_type=page --name=terms --field=ID 2>/dev/null)
if [ -n "$TER_ID" ]; then
    wp post update "$TER_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Legal","heading":"Terms of Service","subtitle":"Effective date: January 1, 2025","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Terms and conditions","align":"full"} /-->

<!-- wp:xfact/section-list {"showNumbers":true,"introText":"Please read these Terms of Service carefully before using the xFact website. These terms govern your access to and use of our website and services.","sections":[{"title":"Acceptance of Terms","content":"By accessing or using the xFact website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."},{"title":"Use of Website","content":"You may use our website for lawful purposes only. You agree not to use the site in any way that could damage, disable, overburden, or impair the site or interfere with any other party'\''s use and enjoyment. You may not attempt to gain unauthorized access to any portion of the website, other accounts, computer systems, or networks connected to the website."},{"title":"Intellectual Property","content":"All content on this website, including text, graphics, logos, images, and software, is the property of xFact or its content suppliers and is protected by United States and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent."},{"title":"Services Description","content":"xFact provides technology services for public-sector organizations, including infrastructure management, cybersecurity, application development, data services, and strategic consulting. Descriptions of services on this website are for informational purposes only and do not constitute a binding offer or contract. Specific service terms are governed by individual client agreements."},{"title":"Disclaimer of Warranties","content":"This website and its content are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied. xFact does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranties regarding the accuracy, reliability, or completeness of any content on this site."},{"title":"Limitation of Liability","content":"To the fullest extent permitted by applicable law, xFact shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of or inability to use the website, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from your use of the website shall not exceed the amount you paid, if any, for accessing the site."},{"title":"Indemnification","content":"You agree to indemnify and hold harmless xFact, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys'\'' fees) arising out of or related to your use of the website or violation of these Terms of Service."},{"title":"Third-Party Links","content":"Our website may contain links to third-party websites or services that are not owned or controlled by xFact. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites. You acknowledge and agree that xFact shall not be responsible or liable for any damage or loss caused by or in connection with the use of any third-party content or services."},{"title":"Governing Law","content":"These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in our principal place of business."},{"title":"Changes to Terms","content":"We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website following any changes constitutes acceptance of the revised terms. We encourage you to review these terms periodically."},{"title":"Contact","content":"If you have any questions about these Terms of Service, please contact us at info@xfact.com or through our contact page."}]} /-->'
    echo "  ✅ Seeded: Terms"
fi

echo "✅ Page content seeding complete."
