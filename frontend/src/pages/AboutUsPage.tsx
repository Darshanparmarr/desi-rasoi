import React from 'react';
import { Leaf, Heart, Award, Truck, Sparkles, Users } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-orange-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Crafting authentic Indian mouth fresheners with love, tradition, and the finest natural ingredients
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image Grid */}
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/images/products/product-1.webp" 
                  alt="Traditional Mukhwas" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/images/products/product-3.webp" 
                  alt="Herbal Mukhwas" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8 transform hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/images/products/product-5.webp" 
                  alt="Sweet Mukhwas" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/images/products/product-6.webp" 
                  alt="Special Mukhwas" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8 transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            {/* Story Content */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">Our Story</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                A Legacy of Freshness Since Generations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                Our journey began with a simple truth: the best flavors come from nature's bounty. 
                For decades, we have been perfecting the art of creating authentic Mukhwas - 
                the traditional Indian mouth freshener that has been a part of our culture for centuries.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                What started as a small family recipe passed down through generations has now 
                blossomed into a passion for sharing the authentic taste of India with the world. 
                Every blend we create is a celebration of our heritage, crafted with the same 
                love and care that our ancestors used.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We don't just create mouth fresheners - we craft experiences rooted in tradition, 
                purity, and wellness. Each ingredient is carefully sourced, each recipe is 
                time-tested, and every batch is made to bring a moment of refreshing joy to your day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 dark:from-green-900/20 to-orange-50 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          {/* Mission */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Preserving Tradition, One Bite at a Time</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                Our mission is to revive and preserve the ancient art of Mukhwas making while 
                making it accessible to everyone. We believe in the power of natural ingredients 
                - fennel seeds, betel nuts, aromatic spices, and dried fruits - to not just 
                freshen breath but to aid digestion and promote wellness.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We focus on authenticity and quality, keeping only what is essential and beneficial. 
                No artificial flavors, no preservatives - just pure, traditional goodness in every handful.
              </p>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img 
                src="/images/products/product-2.webp" 
                alt="Our Mission" 
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/images/products/product-4.webp" 
                alt="Our Vision" 
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
                <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">Our Vision</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Bringing India's Heritage to Every Home</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                We envision a world where the ancient wisdom of Ayurveda and traditional Indian 
                wellness practices are embraced globally. Our goal is to make Mukhwas not just a 
                post-meal ritual but a daily wellness habit for people everywhere.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We strive to build a community of individuals who choose natural over artificial, 
                tradition over trends, and wellness over quick fixes. Together, we can keep this 
                beautiful tradition alive for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mt-2">The Mukhwas Difference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 dark:from-green-900/20 to-green-100 dark:to-green-900/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">100% Natural</h3>
              <p className="text-gray-600 dark:text-gray-400">Made with pure, natural ingredients sourced directly from trusted farmers across India.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-orange-50 dark:from-orange-900/20 to-orange-100 dark:to-orange-900/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Authentic Recipes</h3>
              <p className="text-gray-600 dark:text-gray-400">Time-tested traditional recipes passed down through generations of Mukhwas makers.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 dark:from-green-900/20 to-green-100 dark:to-green-900/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Health Benefits</h3>
              <p className="text-gray-600 dark:text-gray-400">Aids digestion, freshens breath naturally, and provides Ayurvedic wellness benefits.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-50 dark:from-orange-900/20 to-orange-100 dark:to-orange-900/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Pan India Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Fresh Mukhwas delivered to your doorstep anywhere in India with care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-800 to-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-green-100">Varieties</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">10K+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">25+</div>
              <div className="text-green-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-green-100">Natural</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 dark:from-orange-900/20 via-white dark:via-gray-800 to-green-50 dark:to-green-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-700 to-green-800 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Users className="w-12 h-12 mx-auto mb-6 text-orange-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Mukhwas Family</h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Be the first to know about exclusive offers, new flavors, wellness tips, 
              and the stories behind our traditional recipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors duration-300">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-green-500 transition-colors duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Purity First</h3>
              <p className="text-gray-600 dark:text-gray-400">We never compromise on quality. Every ingredient is tested and every batch is checked.</p>
            </div>
            <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-orange-500 transition-colors duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Made with Love</h3>
              <p className="text-gray-600 dark:text-gray-400">Every packet of Mukhwas is prepared with the same care as we would for our own family.</p>
            </div>
            <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-green-500 transition-colors duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Community First</h3>
              <p className="text-gray-600 dark:text-gray-400">We support local farmers and artisans, keeping traditional livelihoods alive.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
