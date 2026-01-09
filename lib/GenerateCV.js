import { jsPDF } from "jspdf";

const GenerateCV = (props) => {
  const downloadPDF = () => {
    // Initialize PDF document
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    // Add font files
    pdf.setFont("helvetica", "normal");

    // Colors
    const primaryColor = [0, 21, 113]; // #8B6142 in RGB
    const darkGray = [0, 0, 0];
    const mediumGray = [0, 0, 0];

    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = {
      top: 20,
      bottom: 20,
      left: 25,
      right: 25,
    };
    const contentWidth = pageWidth - (margin.left + margin.right);
    let yPosition = margin.top;

    // Helper function to add text with proper styling
    const addText = (text, options = {}) => {
      const {
        fontSize = 10,
        color = darkGray,
        font = "helvetica",
        isBold = false,
        isUpperCase = false,
        align = "left",
        leading = 1.5,
        maxWidth = contentWidth,
      } = options;

      pdf.setFont(font, isBold ? "bold" : "normal");
      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);

      const processedText = isUpperCase ? text.toUpperCase() : text;

      // Check for new page
      if (yPosition > pageHeight - margin.bottom) {
        pdf.addPage();
        yPosition = margin.top;
      }

      const lines = pdf.splitTextToSize(processedText, maxWidth);
      pdf.text(
        lines,
        align === "right" ? pageWidth - margin.right : margin.left,
        yPosition,
        {
          align: align,
        }
      );

      const textHeight = lines.length * fontSize * 0.3527 * leading;
      yPosition += textHeight;

      return textHeight;
    };

    // Add header
    if (props.firstName || props.lastName) {
      addText(`${props.firstName} ${props.lastName}`.trim(), {
        fontSize: 24,
        color: primaryColor,
        font: "times",
        leading: 1.2,
      });
    }

    if (props.headline) {
      addText(props.headline, {
        fontSize: 10,
        color: mediumGray,
        // leading: 1.2,
      });
    }

    // Add contact details right-aligned
    yPosition -= 15; // Move back up to align with name
    if (props.address) {
      addText(props.address, {
        fontSize: 9,
        color: mediumGray,
        align: "right",
      });
    }
    if (props.contactNumber) {
      addText(props.contactNumber, {
        fontSize: 9,
        color: mediumGray,
        align: "right",
      });
    }
    if (props.email) {
      addText(props.email, {
        fontSize: 9,
        color: mediumGray,
        align: "right",
      });
    }

    // Add separator line
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.2);
    pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);

    // Personal Profile
    if (props.personalProfile) {
      yPosition += 10;
      addText("PERSONAL PROFILE", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });
      addText(props.personalProfile, {
        fontSize: 8,
        color: darkGray,
        leading: 1.5,
      });
      yPosition += 2;
    }

    if (props.personalProfile && props.dob) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.1);
      pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);
      yPosition += 5;
    }

    // Personal Information
    if (
      props.dob ||
      props.nationality ||
      props.maritalStatus ||
      props.languages ||
      props.religion ||
      props.ethnicity ||
      props.linkedin ||
      props.x ||
      props.instagram ||
      props.facebook ||
      props.github ||
      props.dribble
    ) {
      yPosition += 5;
      addText("PERSONAL INFORMATION", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });

      // Calculate positions for two columns
      const leftColX = margin.left;
      const rightColX = margin.left + contentWidth / 2 + 10; // 10mm gap between columns
      const startY = yPosition;
      let leftColY = yPosition;
      let rightColY = yPosition;

      // Left column items
      if (props.dob) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Date of Birth:", leftColX, leftColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.dob, leftColX + 25, leftColY);
        leftColY += 6;
      }

      if (props.nationality) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Nationality:", leftColX, leftColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.nationality, leftColX + 25, leftColY);
        leftColY += 6;
      }

      if (props.maritalStatus) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Marital Status:", leftColX, leftColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.maritalStatus, leftColX + 25, leftColY);
        leftColY += 6;
      }

      if (props.linkedin) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("LinkedIn:", leftColX, leftColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.linkedin, leftColX + 25, leftColY);
        leftColY += 6;
      }

      if (props.instagram) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Instagram:", leftColX, leftColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.instagram, leftColX + 25, leftColY);
        leftColY += 6;
      }

      if (props.github) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Github:", leftColX, leftColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.github, leftColX + 25, leftColY);
        leftColY += 6;
      }

      // Right column items
      if (props.languages) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Languages:", rightColX, rightColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.languages, rightColX + 25, rightColY);
        rightColY += 6;
      }

      if (props.religion) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Religion:", rightColX, rightColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.religion, rightColX + 25, rightColY);
        rightColY += 6;
      }

      if (props.ethnicity) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Ethnicity:", rightColX, rightColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.ethnicity, rightColX + 25, rightColY);
        rightColY += 6;
      }

      if (props.x) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("X:", rightColX, rightColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.x, rightColX + 25, rightColY);
        rightColY += 6;
      }

      if (props.facebook) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Facebook:", rightColX, rightColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.facebook, rightColX + 25, rightColY);
        rightColY += 6;
      }

      if (props.dribble) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text("Website:", rightColX, rightColY);
        pdf.setFont("helvetica", "normal");
        pdf.text(props.dribble, rightColX + 25, rightColY);
        rightColY += 6;
      }

      // Set yPosition to the lower of the two columns
      yPosition = Math.max(leftColY, rightColY);
      // yPosition += 5; // Add spacing after the section
    }

    if (props.dob && props.candidate_experience) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.1);
      pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);
      yPosition += 5;
    }

    // Work Experience
    if (props.candidate_experience?.length > 0) {
      yPosition += 5;
      addText("WORK EXPERIENCE", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });

      props.candidate_experience.forEach((exp) => {
        const dateText = `${formatDate(exp.startDate)} - ${
          exp.endDate ? formatDate(exp.endDate) : "Present"
        }`;

        // Position and date on same line
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text(exp.position, margin.left, yPosition);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...mediumGray);
        pdf.text(dateText, pageWidth - margin.right, yPosition, {
          align: "right",
        });

        yPosition += 5;

        // Company name
        addText(exp.companyName, {
          fontSize: 8,
          color: mediumGray,
          leading: 1.2,
        });

        // Work description
        if (exp.workDescription) {
          const descriptions = exp.workDescription.split("\n");
          descriptions.forEach((desc) => {
            addText(`• ${desc}`, {
              fontSize: 8,
              color: darkGray,
              leading: 1.3,
            });
          });
        }
        yPosition += 5;
      });
    }

    if (props.candidate_experience && props.candidate_education) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.1);
      pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);
      yPosition += 5;
    }

    // Education section
    if (props.candidate_education?.length > 0) {
      yPosition += 5;
      addText("EDUCATION", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });

      props.candidate_education.forEach((edu) => {
        const dateText = `${formatDate(edu.startDate)} - ${
          edu.endDate ? formatDate(edu.endDate) : "Present"
        }`;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text(edu.educationName, margin.left, yPosition);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...mediumGray);
        pdf.text(dateText, pageWidth - margin.right, yPosition, {
          align: "right",
        });
        yPosition += 5;

        addText(edu.location, {
          fontSize: 8,
          color: mediumGray,
          leading: 1.2,
        });
        yPosition += 5;
      });
    }

    if (props.candidate_education && props.candidate_certifications) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.1);
      pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);
      yPosition += 5;
    }

    // Licences & Certifications
    if (props.candidate_certifications?.length > 0) {
      yPosition += 5;
      addText("LICENCES & CERTIFICATIONS", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });

      props.candidate_certifications.forEach((cert) => {
        const dateText = `${formatDate(cert.receivedDate)}`;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.text(cert.certificateName, margin.left, yPosition);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...mediumGray);
        pdf.text(dateText, pageWidth - margin.right, yPosition, {
          align: "right",
        });
        yPosition += 5;

        addText(cert.organizationName, {
          fontSize: 8,
          color: mediumGray,
          leading: 1.2,
        });
        yPosition += 5;
      });
    }

    if (props.candidate_certifications && props.professionalExpertise) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.1);
      pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);
      yPosition += 5;
    }

    // Professional Experitse
    if (props.professionalExpertise?.length > 0) {
      yPosition += 5;
      addText("PROFESSIONAL EXPERTISE", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });

      props.professionalExpertise.forEach((expertise) => {
        addText(`• ${expertise}`, {
          fontSize: 8,
          color: darkGray,
          leading: 1.5,
        });
      });
      yPosition += 5;
    }

    if (props.professionalExpertise && props.softSkills) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.1);
      pdf.line(margin.left, yPosition, pageWidth - margin.right, yPosition);
      yPosition += 5;
    }

    // Soft Skills
    if (props.softSkills?.length > 0) {
      yPosition += 5;
      addText("SOFT SKILLS", {
        fontSize: 12,
        color: primaryColor,
        font: "times",
        isUpperCase: true,
        leading: 1.5,
      });

      props.softSkills.forEach((expertise) => {
        addText(`• ${expertise}`, {
          fontSize: 8,
          color: darkGray,
          leading: 1.5,
        });
      });
      yPosition += 5;
    }

    // Add page numbers
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...mediumGray);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin.right,
        pageHeight - 10,
        { align: "right" }
      );
    }

    // Save the PDF
    pdf.save(`${props.firstName}_${props.lastName}_CV.pdf`);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  downloadPDF();
};

export default GenerateCV;
