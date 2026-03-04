import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nameError, setNameError] = useState("");
  const [messageError, setMessageError] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!name.trim()) {
      setNameError("Name is required");
      hasError = true;
      nameRef.current?.focus();
    }

    if (!message.trim()) {
      setMessageError("Message is required");
      hasError = true;
      if (!hasError || name.trim()) messageRef.current?.focus();
    }

    if (hasError) return;

    setIsSubmitting(true);

    // Simulate submission (in a real app, this would send to a backend)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Thank you for your feedback! 🙏");
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Feedback</CardTitle>
          <CardDescription>
            We'd love to hear from you! Share your thoughts, suggestions, or
            report any issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                data-ocid="feedback.name.input"
                ref={nameRef}
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="Your name"
                className={
                  nameError ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {nameError && (
                <p
                  data-ocid="feedback.name.error_state"
                  className="text-sm text-red-500 mt-1"
                >
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Textarea
                data-ocid="feedback.message.textarea"
                ref={messageRef}
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (messageError) setMessageError("");
                }}
                placeholder="Share your feedback, suggestions, or report issues..."
                rows={8}
                className={
                  messageError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {messageError && (
                <p
                  data-ocid="feedback.message.error_state"
                  className="text-sm text-red-500 mt-1"
                >
                  {messageError}
                </p>
              )}
            </div>

            <Button
              data-ocid="feedback.submit_button"
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
