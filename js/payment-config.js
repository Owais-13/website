// Payment Configuration for VisaFluent
// Configure your payment gateway settings here

const PAYMENT_CONFIG = {
    // Razorpay Configuration
    razorpay: {
        // Test keys (replace with live keys for production)
        test_key: "rzp_test_9999999999",
        live_key: "rzp_live_your_actual_key", // Replace with your actual live key
        
        // Use test key for development, live key for production
        current_key: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? "rzp_test_9999999999" 
            : "rzp_live_your_actual_key",
        
        // Currency settings
        currency: "INR",
        
        // Company details
        company: {
            name: "VisaFluent",
            description: "IELTS Training Course",
            logo: "/images/logo.png",
            theme_color: "#ff9f43"
        }
    },
    
    // Course pricing (in paisa - multiply by 100)
    courses: {
        listening: {
            name: "Listening Skills",
            price: 5999,
            amount: 599900, // in paisa
            duration: "4 weeks",
            features: ["Expert coaching", "Mock tests", "Audio practice"]
        },
        reading: {
            name: "Reading Skills", 
            price: 6999,
            amount: 699900,
            duration: "4 weeks",
            features: ["Speed reading", "Comprehension techniques", "Practice tests"]
        },
        writing: {
            name: "Writing Skills",
            price: 7999,
            amount: 799900,
            duration: "6 weeks",
            features: ["Essay structure", "Task 1 & 2", "Expert feedback"]
        },
        speaking: {
            name: "Speaking Skills",
            price: 8999,
            amount: 899900,
            duration: "4 weeks",
            features: ["Fluency training", "Pronunciation", "Mock interviews"]
        },
        complete: {
            name: "Complete IELTS Package",
            price: 24999,
            amount: 2499900,
            duration: "12 weeks",
            features: ["All 4 modules", "Personal mentor", "Score guarantee"]
        }
    },
    
    // Success/Failure URLs
    urls: {
        success: "/payment-success.html",
        failure: "/payment-failure.html",
        cancel: "/courses.html"
    }
};

// Payment processing functions
const PaymentProcessor = {
    
    // Initialize payment for a course
    processPayment: function(courseKey, userDetails) {
        const course = PAYMENT_CONFIG.courses[courseKey];
        if (!course) {
            console.error('Invalid course selected');
            alert('Invalid course selected. Please try again.');
            return;
        }
        
        const options = {
            "key": PAYMENT_CONFIG.razorpay.current_key,
            "amount": course.amount,
            "currency": PAYMENT_CONFIG.razorpay.currency,
            "name": PAYMENT_CONFIG.razorpay.company.name,
            "description": course.name + " - " + course.duration,
            "image": PAYMENT_CONFIG.razorpay.company.logo,
            "order_id": this.generateOrderId(), // You should generate this from your backend
            "handler": function (response) {
                PaymentProcessor.handleSuccess(response, course, userDetails);
            },
            "prefill": {
                "name": userDetails.firstName + ' ' + userDetails.lastName,
                "email": userDetails.email,
                "contact": userDetails.phone
            },
            "notes": {
                "course": courseKey,
                "target_score": userDetails.targetScore,
                "exam_date": userDetails.examDate,
                "student_id": this.generateStudentId()
            },
            "theme": {
                "color": PAYMENT_CONFIG.razorpay.company.theme_color
            },
            "modal": {
                "ondismiss": function() {
                    PaymentProcessor.handleCancel();
                }
            }
        };
        
        try {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response) {
                PaymentProcessor.handleFailure(response);
            });
            rzp.open();
        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Payment service is currently unavailable. Please try again later.');
        }
    },
    
    // Handle successful payment
    handleSuccess: function(response, course, userDetails) {
        console.log('Payment successful:', response);
        
        // Store enrollment data
        const enrollmentData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            course: course,
            student: userDetails,
            timestamp: new Date().toISOString(),
            status: 'completed'
        };
        
        // Save to localStorage (in real app, send to backend)
        localStorage.setItem('lastEnrollment', JSON.stringify(enrollmentData));
        
        // Show success message
        this.showSuccessMessage(course.name, response.razorpay_payment_id);
        
        // Send confirmation email (implement this in your backend)
        this.sendConfirmationEmail(enrollmentData);
        
        // Redirect to success page or close modal
        setTimeout(() => {
            $('#enrollModal').modal('hide');
            window.location.href = PAYMENT_CONFIG.urls.success + '?payment_id=' + response.razorpay_payment_id;
        }, 2000);
    },
    
    // Handle payment failure
    handleFailure: function(response) {
        console.error('Payment failed:', response);
        alert('Payment failed: ' + response.error.description + '\nPlease try again or contact support.');
    },
    
    // Handle payment cancellation
    handleCancel: function() {
        console.log('Payment cancelled by user');
        // Optional: Track cancellation for analytics
    },
    
    // Show success message
    showSuccessMessage: function(courseName, paymentId) {
        const successHtml = `
            <div class="alert alert-success" role="alert">
                <h4 class="alert-heading">Payment Successful!</h4>
                <p>Thank you for enrolling in <strong>${courseName}</strong></p>
                <p>Payment ID: <strong>${paymentId}</strong></p>
                <hr>
                <p class="mb-0">You will receive a confirmation email shortly with course access details.</p>
            </div>
        `;
        
        // Replace modal content with success message
        $('.modal-body').html(successHtml);
        $('.modal-footer').hide();
    },
    
    // Generate order ID (in real app, this should come from backend)
    generateOrderId: function() {
        return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Generate student ID
    generateStudentId: function() {
        return 'VF_' + Date.now().toString(36).toUpperCase();
    },
    
    // Send confirmation email (placeholder - implement in backend)
    sendConfirmationEmail: function(enrollmentData) {
        // This should be implemented in your backend
        console.log('Sending confirmation email for:', enrollmentData);
        
        // For demo purposes, show email template
        const emailTemplate = {
            to: enrollmentData.student.email,
            subject: `Welcome to VisaFluent - ${enrollmentData.course.name} Enrollment Confirmed`,
            body: `
                Dear ${enrollmentData.student.firstName},
                
                Welcome to VisaFluent! Your enrollment for ${enrollmentData.course.name} has been confirmed.
                
                Course Details:
                - Course: ${enrollmentData.course.name}
                - Duration: ${enrollmentData.course.duration}
                - Payment ID: ${enrollmentData.paymentId}
                - Student ID: ${enrollmentData.timestamp}
                
                What's Next:
                1. You will receive course access within 24 hours
                2. Our team will contact you to schedule your first session
                3. Join our WhatsApp group for updates
                
                Contact us at info@visafluent.com for any questions.
                
                Best regards,
                VisaFluent Team
            `
        };
        
        console.log('Email template:', emailTemplate);
    },
    
    // Validate form data
    validateEnrollmentForm: function(formData) {
        const errors = [];
        
        if (!formData.firstName || formData.firstName.trim().length < 2) {
            errors.push('First name is required (minimum 2 characters)');
        }
        
        if (!formData.lastName || formData.lastName.trim().length < 2) {
            errors.push('Last name is required (minimum 2 characters)');
        }
        
        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Valid email address is required');
        }
        
        if (!formData.phone || !this.isValidPhone(formData.phone)) {
            errors.push('Valid phone number is required');
        }
        
        if (!formData.course) {
            errors.push('Please select a course');
        }
        
        return errors;
    },
    
    // Email validation
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Phone validation
    isValidPhone: function(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },
    
    // Get course details
    getCourseDetails: function(courseKey) {
        return PAYMENT_CONFIG.courses[courseKey];
    },
    
    // Format price for display
    formatPrice: function(amount) {
        return '₹' + (amount / 100).toLocaleString('en-IN');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PAYMENT_CONFIG, PaymentProcessor };
} 