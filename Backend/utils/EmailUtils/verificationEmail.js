const {
  Html,
  Head,
  Body,
  Container,
  Section,
  Column,
  Row,
  Text,
  Heading,
  Hr,
  Link,
  Button,
  Img,
  Font,
} = require('react-email/components');

const OTPEmail = ({ otp, username }) => {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial, sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <title>Verify Your Email Address</title>
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Row>
              <Column align="center">
                <Heading style={titleStyle}>Verify Your Email Address</Heading>
                <Text style={welcomeStyle}>Welcome aboard, {username}!</Text>
              </Column>
            </Row>
          </Section>

          <Section style={contentSection}>
            <Row>
              <Column>
                <Text style={textStyle}>
                  Thank you for joining our community! To complete your registration and ensure the security of your account, please verify your email address using the One-Time Password (OTP) below.
                </Text>
              </Column>
            </Row>

            <Section style={otpContainer}>
              <Row>
                <Column align="center">
                  <Text style={otpLabel}>Your Verification Code</Text>
                  <Text style={otpCode}>{otp}</Text>
                  <Text style={noteStyle}>This code will expire in 10 minutes</Text>
                </Column>
              </Row>
            </Section>

            <Row>
              <Column>
                <Text style={textStyle}>
                  Enter this code in the verification field on our website to activate your account. If you didn't request this code, please ignore this email or contact our support team.
                </Text>
              </Column>
            </Row>

            <Row>
              <Column align="center" style={buttonContainer}>
                <Button href="http://localhost:3000/OTPVerify" style={buttonStyle}>
                  Verify My Account
                </Button>
              </Column>
            </Row>
          </Section>

          <Hr style={dividerStyle} />

          <Section style={footerSection}>
            <Row>
              <Column align="center">
                <Text style={footerText}>
                  Need help? Contact our support team at{" "}
                  <Link href="mailto:support@yourcompany.com" style={linkStyle}>
                    support@yourcompany.com
                  </Link>
                </Text>
                <Text style={copyright}>
                  © {new Date().getFullYear()} Your Company Name. All rights reserved.
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: '#f7f9fc',
  fontFamily: "'Inter', Arial, sans-serif",
  lineHeight: '1.6',
  color: '#333333',
  margin: 0,
  padding: '20px 0',
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headerSection = {
  padding: '40px 30px',
  backgroundColor: '#4f46e5',
  textAlign: 'center',
  color: 'white',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 10px 0',
  color: 'white',
};

const welcomeStyle = {
  fontSize: '18px',
  margin: '0',
  opacity: '0.9',
  color: 'white',
};

const contentSection = {
  padding: '40px 30px',
};

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
  color: '#555555',
};

const otpContainer = {
  margin: '30px 0',
  padding: '25px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px dashed #4f46e5',
  textAlign: 'center',
};

const otpLabel = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  color: '#333333',
};

const otpCode = {
  fontSize: '42px',
  fontWeight: '700',
  letterSpacing: '8px',
  color: '#4f46e5',
  margin: '15px 0',
  padding: '15px',
  backgroundColor: '#f0f3ff',
  borderRadius: '8px',
  fontFamily: "'Courier New', monospace",
  lineHeight: '1.2',
};

const noteStyle = {
  fontSize: '14px',
  color: '#888888',
  fontStyle: 'italic',
  margin: '10px 0 0 0',
};

const buttonContainer = {
  margin: '30px 0 20px 0',
};

const buttonStyle = {
  backgroundColor: '#4f46e5',
  color: 'white',
  padding: '16px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
};

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '0',
};

const footerSection = {
  padding: '25px 30px',
  backgroundColor: '#f8f9fa',
  textAlign: 'center',
};

const footerText = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 10px 0',
};

const linkStyle = {
  color: '#4f46e5',
  textDecoration: 'underline',
};

const copyright = {
  fontSize: '12px',
  color: '#999999',
  margin: '0',
};

module.exports = {OTPEmail}