import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnalyzedWord {
  word: string;
  pos: string;
  posRu: string;
  gender?: string;
  number?: string;
  person?: string;
  syntaxRole?: string;
  syntaxRoleRu?: string;
  details?: string;
}

const Index = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [analyzedWords, setAnalyzedWords] = useState<AnalyzedWord[]>([]);
  const [activeTab, setActiveTab] = useState('analyzer');

  const posColors: Record<string, string> = {
    noun: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    verb: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    adjective: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    adverb: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    pronoun: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    preposition: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    conjunction: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    article: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  };

  const analyzeText = () => {
    if (!text.trim()) return;

    const words = text.split(/\s+/);
    const analyzed: AnalyzedWord[] = [];

    if (language === 'fr') {
      words.forEach((word) => {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        
        if (cleanWord.toLowerCase() === 'le' || cleanWord.toLowerCase() === 'la' || cleanWord.toLowerCase() === 'les') {
          analyzed.push({
            word: cleanWord,
            pos: 'article',
            posRu: 'Артикль',
            number: cleanWord.toLowerCase() === 'les' ? 'множ.' : 'ед.',
            gender: cleanWord.toLowerCase() === 'le' ? 'муж.' : cleanWord.toLowerCase() === 'la' ? 'жен.' : undefined,
            syntaxRole: 'determiner',
            syntaxRoleRu: 'Определитель'
          });
        } else if (cleanWord.toLowerCase() === 'chat') {
          analyzed.push({
            word: cleanWord,
            pos: 'noun',
            posRu: 'Существительное',
            gender: 'муж.',
            number: 'ед.',
            syntaxRole: 'subject',
            syntaxRoleRu: 'Подлежащее',
            details: 'chat (м.р.) - кот'
          });
        } else if (cleanWord.toLowerCase() === 'mange') {
          analyzed.push({
            word: cleanWord,
            pos: 'verb',
            posRu: 'Глагол',
            person: '3-е лицо',
            number: 'ед.',
            syntaxRole: 'predicate',
            syntaxRoleRu: 'Сказуемое',
            details: 'manger, présent, 3 sg.'
          });
        } else if (cleanWord.toLowerCase() === 'noir') {
          analyzed.push({
            word: cleanWord,
            pos: 'adjective',
            posRu: 'Прилагательное',
            gender: 'муж.',
            number: 'ед.',
            syntaxRole: 'attribute',
            syntaxRoleRu: 'Определение',
            details: 'согласуется с существительным'
          });
        } else {
          analyzed.push({
            word: cleanWord,
            pos: 'noun',
            posRu: 'Существительное',
            gender: 'муж.',
            number: 'ед.',
            syntaxRole: 'object',
            syntaxRoleRu: 'Дополнение'
          });
        }
      });
    } else {
      words.forEach((word) => {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        
        if (cleanWord.toLowerCase() === 'the' || cleanWord.toLowerCase() === 'a' || cleanWord.toLowerCase() === 'an') {
          analyzed.push({
            word: cleanWord,
            pos: 'article',
            posRu: 'Артикль',
            syntaxRole: 'determiner',
            syntaxRoleRu: 'Определитель'
          });
        } else if (cleanWord.toLowerCase() === 'cat') {
          analyzed.push({
            word: cleanWord,
            pos: 'noun',
            posRu: 'Существительное',
            number: 'ед.',
            syntaxRole: 'subject',
            syntaxRoleRu: 'Подлежащее'
          });
        } else if (cleanWord.toLowerCase() === 'eats' || cleanWord.toLowerCase() === 'eat') {
          analyzed.push({
            word: cleanWord,
            pos: 'verb',
            posRu: 'Глагол',
            person: '3-е лицо',
            number: 'ед.',
            syntaxRole: 'predicate',
            syntaxRoleRu: 'Сказуемое',
            details: 'Present Simple'
          });
        } else if (cleanWord.toLowerCase() === 'black') {
          analyzed.push({
            word: cleanWord,
            pos: 'adjective',
            posRu: 'Прилагательное',
            syntaxRole: 'attribute',
            syntaxRoleRu: 'Определение'
          });
        } else {
          analyzed.push({
            word: cleanWord,
            pos: 'noun',
            posRu: 'Существительное',
            number: 'ед.',
            syntaxRole: 'object',
            syntaxRoleRu: 'Дополнение'
          });
        }
      });
    }

    setAnalyzedWords(analyzed);
  };

  const exampleSentences = {
    fr: [
      'Le chat noir mange.',
      'Les étudiants écrivent rapidement.',
      'La belle maison est grande.',
    ],
    en: [
      'The black cat eats.',
      'Students write quickly.',
      'The beautiful house is big.',
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/IMG_20251211_114230_991.jpg" 
                alt="ЛИНГВОСКАНЕР" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">ЛИНГВОСКАНЕР</h1>
                <p className="text-sm text-muted-foreground">Открывай мир слов, расширяй горизонты</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="User" size={16} className="mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Icon name="Scan" size={16} />
              Анализатор
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex items-center gap-2">
              <Icon name="BookMarked" size={16} />
              Справочник
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Примеры
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Icon name="History" size={16} />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="space-y-6 animate-fade-in">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Морфологический анализ</CardTitle>
                    <CardDescription className="mt-2">
                      Введите предложение для полного разбора частей речи и синтаксических ролей
                    </CardDescription>
                  </div>
                  <Select value={language} onValueChange={(val) => setLanguage(val as 'fr' | 'en')}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Французский</SelectItem>
                      <SelectItem value="en">🇬🇧 Английский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Введите предложение для анализа..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-32 text-lg"
                />
                <Button onClick={analyzeText} size="lg" className="w-full" disabled={!text.trim()}>
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Анализировать предложение
                </Button>
              </CardContent>
            </Card>

            {analyzedWords.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Target" size={22} />
                      Результаты анализа
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {analyzedWords.map((item, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className={`text-base py-2 px-4 ${posColors[item.pos] || ''}`}
                        >
                          {item.word}
                        </Badge>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      {analyzedWords.map((item, idx) => (
                        <Card key={idx} className="bg-muted/30">
                          <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-bold text-xl mb-3 text-primary">{item.word}</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Tag" size={16} className="text-muted-foreground" />
                                    <span className="text-muted-foreground">Часть речи:</span>
                                    <Badge className={posColors[item.pos]}>{item.posRu}</Badge>
                                  </div>
                                  {item.gender && (
                                    <div className="flex items-center gap-2">
                                      <Icon name="Circle" size={16} className="text-muted-foreground" />
                                      <span className="text-muted-foreground">Род:</span>
                                      <span className="font-medium">{item.gender}</span>
                                    </div>
                                  )}
                                  {item.number && (
                                    <div className="flex items-center gap-2">
                                      <Icon name="Hash" size={16} className="text-muted-foreground" />
                                      <span className="text-muted-foreground">Число:</span>
                                      <span className="font-medium">{item.number}</span>
                                    </div>
                                  )}
                                  {item.person && (
                                    <div className="flex items-center gap-2">
                                      <Icon name="User" size={16} className="text-muted-foreground" />
                                      <span className="text-muted-foreground">Лицо:</span>
                                      <span className="font-medium">{item.person}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-3 text-secondary">Синтаксическая роль</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Network" size={16} className="text-muted-foreground" />
                                    <Badge variant="outline" className="font-medium">
                                      {item.syntaxRoleRu}
                                    </Badge>
                                  </div>
                                  {item.details && (
                                    <div className="mt-3 p-3 bg-background rounded-md border">
                                      <p className="text-xs text-muted-foreground">{item.details}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reference" className="animate-fade-in">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Languages" size={20} />
                    Части речи
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries({
                    noun: 'Существительное',
                    verb: 'Глагол',
                    adjective: 'Прилагательное',
                    adverb: 'Наречие',
                    pronoun: 'Местоимение',
                    preposition: 'Предлог',
                    conjunction: 'Союз',
                    article: 'Артикль',
                  }).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <Badge className={`${posColors[key]} min-w-[140px] justify-center`}>{value}</Badge>
                      <span className="text-sm text-muted-foreground">{key}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="GitBranch" size={20} />
                    Синтаксические роли
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { ru: 'Подлежащее', en: 'Subject', icon: 'User' },
                    { ru: 'Сказуемое', en: 'Predicate', icon: 'Zap' },
                    { ru: 'Дополнение', en: 'Object', icon: 'Box' },
                    { ru: 'Определение', en: 'Attribute', icon: 'Tag' },
                    { ru: 'Обстоятельство', en: 'Adverbial', icon: 'MapPin' },
                  ].map((item) => (
                    <div key={item.en} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <Icon name={item.icon as any} size={18} className="text-primary" />
                      <div className="flex-1">
                        <span className="font-medium">{item.ru}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.en})</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Lightbulb" size={20} />
                    Примеры предложений
                  </CardTitle>
                  <CardDescription>Нажмите на предложение, чтобы проанализировать</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      🇫🇷 Французский язык
                    </h3>
                    <div className="space-y-2">
                      {exampleSentences.fr.map((sentence, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => {
                            setLanguage('fr');
                            setText(sentence);
                            setActiveTab('analyzer');
                          }}
                        >
                          <Icon name="ArrowRight" size={16} className="mr-2 flex-shrink-0" />
                          {sentence}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      🇬🇧 Английский язык
                    </h3>
                    <div className="space-y-2">
                      {exampleSentences.en.map((sentence, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => {
                            setLanguage('en');
                            setText(sentence);
                            setActiveTab('analyzer');
                          }}
                        >
                          <Icon name="ArrowRight" size={16} className="mr-2 flex-shrink-0" />
                          {sentence}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    История анализов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="FileSearch" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      История анализов будет сохраняться здесь
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Начните анализировать предложения, чтобы увидеть историю
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img 
                src="https://cdn.poehali.dev/files/IMG_20251211_114230_991.jpg" 
                alt="ЛИНГВОСКАНЕР" 
                className="w-6 h-6 rounded object-cover"
              />
              <span>ЛИНГВОСКАНЕР © 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">О проекте</a>
              <a href="#" className="hover:text-foreground transition-colors">Контакты</a>
              <a href="#" className="hover:text-foreground transition-colors">Помощь</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;