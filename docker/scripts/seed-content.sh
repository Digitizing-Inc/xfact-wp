#!/bin/sh
# Page Content Seeder for xFact WordPress Theme.
#
# Populates each page's post_content with the appropriate block markup.
# Called by setup.sh after pages are created.
#
# Usage: sh seed-content.sh

set -eu

echo "📝 Seeding page content..."

: "${WP_SITE_URL:?missing}"

# Theme assets base URL — used for image attributes.
SITE_URL=$(wp option get siteurl 2>/dev/null || echo "$WP_SITE_URL")
ASSETS="${SITE_URL}/wp-content/themes/xfact/assets/images"

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

# ── Solutions ─────────────────────────────────────────────────
SOL_ID=$(wp post list --post_type=page --name=solutions --field=ID 2>/dev/null)
if [ -n "$SOL_ID" ]; then
    wp post update "$SOL_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Reliable Systems. Stronger Communities.","subtitle":"xFact supports mission-critical systems across complex public-sector environments. A single accountable partner improves reliability and reduces complexity.","backgroundImage":"'"${ASSETS}"'/hero-solutions.jpg","imageAlt":"Healthcare workers collaborating","align":"full"} /-->

<!-- wp:xfact/text-section {"sectionIcon":"Shield","sectionLabel":"Public Safety \u0026 Justice","heading":"Strengthening Systems That Cannot Fail","body":"Public safety agencies operate in environments where technology reliability is critical to real-time operations. Communications infrastructure and secure information environments must remain continuously available while meeting stringent security and compliance requirements. xFact helps public safety organizations maintain resilient and secure technology environments that support mission-critical operations and ensure systems remain dependable in high-consequence situations.","tags":[{"label":"Public Safety Data Broker Solution"},{"label":"License Management System"},{"label":"Cloud Migration Strategic Roadmap"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"Landmark","sectionLabel":"Municipal, State \u0026 Local Government","heading":"Coordinating Systems That Support Communities","body":"State, municipal, and county governments rely on interconnected systems that support essential community services. From public works and administrative operations to digital services and civic infrastructure, these systems must remain secure, resilient, and continuously operational. xFact helps state and local governments strengthen and coordinate these technology environments so departments can operate reliably, manage growing complexity, and sustain the services communities depend on.","tags":[{"label":"Enterprise Risk Management Plan"},{"label":"Hybrid Cloud Data Center Migration"},{"label":"Covid-19 and Collaboration"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"GraduationCap","sectionLabel":"Education","heading":"Supporting Learning Through Reliable Systems","body":"Schools rely on secure and reliable technology environments to support teaching, learning, and student services. From classroom connectivity and instructional platforms to administrative systems and student data, these environments must remain continuously available. xFact helps school systems maintain stable, secure infrastructure that supports educators, protects student data, and enables technology environments to evolve responsibly without disrupting the learning experience.","tags":[{"label":"AI Learning Platform"},{"label":"Network Infrastructure Overhaul"},{"label":"Digital Transformation Consulting"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"HeartPulse","sectionLabel":"Health \u0026 Human Services","heading":"Supporting Systems That Serve Communities","body":"Health and human services agencies depend on secure, reliable systems that support care delivery, compliance, and community services. From patient management and clinical systems to eligibility platforms and interagency data exchange, these environments must meet strict regulatory requirements while remaining accessible and operational. xFact helps HHS organizations maintain technology environments that support continuous service delivery, protect sensitive data, and adapt to evolving regulatory and operational demands.","tags":[{"label":"EHR Integration"},{"label":"HIPAA Compliance Infrastructure"},{"label":"Telehealth Platform Migration"}]} /-->

<!-- wp:xfact/text-section {"sectionIcon":"ServerCog","sectionLabel":"Infrastructure \u0026 Managed Services","heading":"Resilient Infrastructure for Mission-Critical Systems","badgeText":"● DataServ, an xFact solution","body":"Organizations that rely on always-on technology need infrastructure that is secure, scalable, and continuously monitored. From private and hybrid cloud environments to wide-area networking, endpoint management, and disaster recovery — reliable infrastructure underpins every service. xFact delivers managed infrastructure services that keep systems stable, reduce risk, and allow organizations to focus on operations rather than technology complexity.","tags":[{"label":"Managed IT Services"},{"label":"Hybrid Cloud Infrastructure"},{"label":"24/7 NOC and SOC Monitoring"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Solutions"
fi

# ── Support ───────────────────────────────────────────────────
SUP_ID=$(wp post list --post_type=page --name=support --field=ID 2>/dev/null)
if [ -n "$SUP_ID" ]; then
    wp post update "$SUP_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Access assistance for your systems and services.","subtitle":"Ongoing support maintains system reliability. Our structured processes enable efficient response and timely issue resolution.","backgroundImage":"'"${ASSETS}"'/hero-support.jpg","imageAlt":"Police officer on duty","align":"full"} /-->

<!-- wp:xfact/support-channels /-->'
    echo "  ✅ Seeded: Support"
fi

# ── Careers ───────────────────────────────────────────────────
CAR_ID=$(wp post list --post_type=page --name=careers --field=ID 2>/dev/null)
if [ -n "$CAR_ID" ]; then
    wp post update "$CAR_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Work behind the systems communities rely on.","subtitle":"Join a team that supports mission-critical technology for public-sector organizations. Build systems that must work every day.","backgroundImage":"'"${ASSETS}"'/hero-careers.jpg","imageAlt":"Volunteers working together","align":"full"} /-->

<!-- wp:xfact/feature-cards {"sectionLabel":"Why xFact","heading":"What it means to work here","cards":[{"title":"Mission-Driven Work","description":"Every project supports systems critical to public services — from public safety to education to healthcare.","iconName":"Target"},{"title":"High-Accountability Environments","description":"Our teams operate in environments where reliability matters. The work we do must function every day.","iconName":"ShieldCheck"},{"title":"Real Impact","description":"Employees contribute directly to systems that serve communities and support essential public operations.","iconName":"Zap"},{"title":"Growth \u0026 Development","description":"Work alongside experienced professionals across infrastructure, security, applications, and strategy.","iconName":"TrendingUp"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Interested in joining the team?","subtitle":"We'\''re always looking for talented people who want to do meaningful work.","primaryLabel":"Get in Touch","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Careers"
fi

# ── Contact ───────────────────────────────────────────────────
CON_ID=$(wp post list --post_type=page --name=contact --field=ID 2>/dev/null)
if [ -n "$CON_ID" ]; then
    wp post update "$CON_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Start the Conversation","subtitle":"Complex environments require thoughtful evaluation.","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Kids using technology in the classroom","align":"full"} /-->

<!-- wp:xfact/contact-form {"heading":"Get in Touch","subtitle":"Tell us about your organization and what you'\''re looking to accomplish. We'\''ll connect you with the right team."} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Technology Assessment","heading":"Evaluate Your Systems","body":"Our technology assessments help organizations understand their current environment, identify risks and opportunities, and develop a practical roadmap for improvement."} /-->'
    echo "  ✅ Seeded: Contact"
fi

# ── Privacy Policy ────────────────────────────────────────────
PRI_ID=$(wp post list --post_type=page --name=privacy --field=ID 2>/dev/null)
if [ -n "$PRI_ID" ]; then
    wp post update "$PRI_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Privacy Policy","subtitle":"","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Privacy and security","align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Legal","heading":"Privacy Policy","body":"xFact (\"we,\" \"us,\" or \"our\") is committed to protecting the privacy of individuals who visit our website and use our services. This Privacy Policy describes how we collect, use, and safeguard your information. If you have questions about this Privacy Policy or our data practices, please contact us at info@xfact.com or through our contact page."} /-->'
    echo "  ✅ Seeded: Privacy"
fi

# ── Terms of Service ──────────────────────────────────────────
TER_ID=$(wp post list --post_type=page --name=terms --field=ID 2>/dev/null)
if [ -n "$TER_ID" ]; then
    wp post update "$TER_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Terms of Service","subtitle":"","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Terms and conditions","align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Legal","heading":"Terms of Service","body":"Please read these Terms of Service carefully before using the xFact website. These terms govern your access to and use of our website and services. By accessing or using our website, you agree to be bound by these terms. If you do not agree, please do not use our website."} /-->'
    echo "  ✅ Seeded: Terms"
fi

echo "✅ Page content seeding complete."
