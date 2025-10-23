import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState('');

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/3a2adb39-a24e-4187-a6de-3bd8be89e3c2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) {
        throw new Error('Failed to save phone');
      }

      const priceListUrl = '/price_list.xlsx';
      const link = document.createElement('a');
      link.href = priceListUrl;
      link.download = 'price_list.xlsx';
      link.click();

      toast.success('Прайс-лист отправлен на скачивание!');
      setIsModalOpen(false);
      setPhone('');
    } catch (error) {
      toast.error('Ошибка при сохранении данных');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-roboto">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-montserrat font-bold text-primary flex items-center gap-2">
            <Icon name="Radio" size={32} className="text-accent" />
            AUTO SOUND
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#about" className="hover:text-primary transition-colors">О компании</a>
            <a href="#advantages" className="hover:text-primary transition-colors">Преимущества</a>
            <a href="#delivery" className="hover:text-primary transition-colors">Доставка</a>
            <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
          </nav>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/20"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://v3b.fal.media/files/b/lion/7mBAp08bBvu7U5PFTeH_c_output.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-montserrat font-black mb-6 text-white leading-tight">
            АВТО-ЗВУК
            <br />
            <span className="text-primary">ОПТОМ</span>
          </h1>
          <div className="h-1 w-32 bg-accent mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Профессиональное аудиооборудование для автомобилей. Качество, скорость, надежность.
          </p>
          <Button 
            onClick={handleDownloadClick}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-black font-montserrat font-bold text-lg px-12 py-6 h-auto animate-slide-up"
          >
            <Icon name="Download" size={24} className="mr-2" />
            СКАЧАТЬ ПРАЙС-ЛИСТ
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={48} className="text-primary" />
        </div>
      </section>

      <section id="about" className="py-24 bg-gradient-to-b from-black to-card">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-montserrat font-bold text-center mb-16 text-primary">
            О КОМПАНИИ
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-lg text-gray-300">
              <p>
                Мы специализируемся на оптовых поставках автомобильного аудиооборудования премиум-класса. 
                Работаем с ведущими мировыми брендами и предлагаем выгодные условия сотрудничества.
              </p>
              <p>
                Наша миссия — обеспечить партнеров качественной продукцией по конкурентным ценам. 
                Более 10 лет на рынке, тысячи довольных клиентов по всей России.
              </p>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">10+</div>
                  <div className="text-sm text-gray-400">лет опыта</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">5000+</div>
                  <div className="text-sm text-gray-400">клиентов</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">50+</div>
                  <div className="text-sm text-gray-400">брендов</div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80" 
                alt="Автомобиль" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-montserrat font-bold text-center mb-16 text-primary">
            ПРЕИМУЩЕСТВА
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { icon: 'Zap', title: 'Быстрая доставка', desc: 'Отгрузка в день заказа' },
              { icon: 'Shield', title: 'Гарантия качества', desc: 'Сертифицированная продукция' },
              { icon: 'DollarSign', title: 'Оптовые цены', desc: 'Скидки от объема' },
              { icon: 'Headphones', title: 'Поддержка 24/7', desc: 'Всегда на связи' }
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-background p-8 rounded-lg text-center hover:scale-105 transition-transform border border-primary/20"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name={item.icon} size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="py-24 bg-gradient-to-b from-card to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-montserrat font-bold text-center mb-16 text-primary">
            ДОСТАВКА
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: 'Truck', title: 'По России', desc: 'Транспортные компании' },
                { icon: 'MapPin', title: 'Самовывоз', desc: 'Со склада в Москве' },
                { icon: 'Package', title: 'Крупный опт', desc: 'Индивидуальные условия' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon} size={36} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-lg border border-accent/20">
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-accent">Условия доставки:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>Бесплатная доставка при заказе от 100 000 руб.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>Работаем со всеми крупными ТК (СДЭК, ПЭК, Деловые Линии)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>Страхование груза и упаковка в фирменную тару</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-montserrat font-bold text-center mb-16 text-primary">
            КОНТАКТЫ
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-xl mb-2">Телефон</h3>
                  <p className="text-gray-300">+7 (495) 123-45-67</p>
                  <p className="text-gray-300">+7 (800) 555-35-35</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-xl mb-2">Email</h3>
                  <p className="text-gray-300">info@autosound-opt.ru</p>
                  <p className="text-gray-300">sales@autosound-opt.ru</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-xl mb-2">Адрес</h3>
                  <p className="text-gray-300">г. Москва, ул. Автозаводская, д. 23</p>
                  <p className="text-gray-400 text-sm mt-1">Пн-Пт: 9:00-18:00</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-montserrat font-bold mb-6 text-accent">Оставьте заявку</h3>
              <form className="space-y-4">
                <Input 
                  placeholder="Ваше имя" 
                  className="bg-background border-border"
                />
                <Input 
                  placeholder="Телефон" 
                  type="tel"
                  className="bg-background border-border"
                />
                <Input 
                  placeholder="Email" 
                  type="email"
                  className="bg-background border-border"
                />
                <Button className="w-full bg-primary hover:bg-primary/90 font-montserrat font-bold">
                  Отправить заявку
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-primary/20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 AUTO SOUND. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-accent/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-montserrat font-bold text-accent">
              Скачать прайс-лист
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Укажите ваш номер телефона для получения актуального прайс-листа
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePhoneSubmit} className="space-y-4 mt-4">
            <Input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background border-border text-lg"
            />
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-black font-montserrat font-bold"
            >
              Скачать прайс
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;