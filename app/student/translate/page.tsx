"use client";

import { useState, type FC } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Languages, AlertCircle, ArrowRightLeft } from "lucide-react";

// A list of common languages for students in India
const languageOptions = [
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'bn', label: 'Bengali (বাংলা)' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'mr', label: 'Marathi (मराठी)' },
  { value: 'ta', label: 'Tamil (தமிழ்)' },
  { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { value: 'ml', label: 'Malayalam (മലയാളം)' },
  { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { value: 'en', label: 'English' },
];

const StudentTranslatePage: FC = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("hi"); // Default to Hindi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setTranslatedText("");

    try {
      const response = await fetch('/api/translate/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, targetLanguage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during translation.');
      }
      setTranslatedText(data.translatedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Concept Translator</h1>
            <p className="text-muted-foreground">Understand complex topics in your native language.</p>
          </div>
        </header>

        <div className="p-8">
          <Card>
            <CardHeader>
              <CardTitle>Translate Text</CardTitle>
              <CardDescription>
                Paste any text below, choose your language, and get an instant translation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Input Text Area */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter the text you want to translate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="h-48 resize-none"
                  />
                </div>

                {/* Output Text Area */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    readOnly
                    className="h-48 resize-none bg-muted/50"
                  />
                </div>
              </div>

              {/* Controls and Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <Languages className="h-5 w-5 text-muted-foreground" />
                   <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                           <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                      </SelectContent>
                   </Select>
                </div>
                
                <Button onClick={handleTranslate} disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Translating..." : 
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Translate
                    </>
                  }
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Translation Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentTranslatePage;