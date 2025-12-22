import { BookOpen, Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-card border-t border-border pt-12 pb-8">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-display text-lg font-semibold text-foreground">BookBazaar</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            India's trusted marketplace for buying and selling second-hand books with ease and confidence.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Github className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold mb-4 text-foreground">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Books</Link></li>
                            <li><Link to="/seller/sell" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sell Your Book</Link></li>
                            <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-display font-semibold mb-4 text-foreground">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-display font-semibold mb-4 text-foreground">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>support@bookbazaar.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                <span>Navi Mumbai, Maharashtra, India</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} BookBazaar. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-[10px] font-bold">COD</div>
                        <span className="text-xs text-muted-foreground">Cash on Delivery Available</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
