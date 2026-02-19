import React from 'react';
import { ArrowRight, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-white pt-16 pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-white"></div>
            <div className="container relative mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-3xl"
                >
                    <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                        v3.0 Now Available
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
                        Operational Analysis <br className="hidden sm:block" />
                        <span className="text-blue-600">Reimagined</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600 mb-10">
                        Advanced wind plant performance analysis made simple. Upload your data, run complex models, and visualize results in seconds.
                    </p>
                    <div className="flex items-center justify-center gap-x-6">
                        <a
                            href="#analysis"
                            className="group flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                        >
                            Start Analysis
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
                            Read docs <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
                    {[
                        { icon: BarChart3, title: "Advanced Analytics", desc: "Industry-standard models for accurate performance assessment." },
                        { icon: Zap, title: "Lightning Fast", desc: "Optimized processing engine delivers results in seconds." },
                        { icon: ShieldCheck, title: "Secure & Private", desc: "Your data is processed locally or securely in the cloud." },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 bg-blue-50 rounded-xl mb-4 text-blue-600">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
