// ФАЙЗ — живые обои. Кладёт окно под значки рабочего стола (за слоем значков Windows)
// и медленно вращает кольца паттерна вокруг «Ф». Картинки берёт из своей папки:
//   bg.png, ring_outer.png, ring_main.png, ring_inner.png, core.png, brand.txt (vape | bakery)
// Запуск без параметров — на рабочий стол; с --preview — в обычном окне для просмотра.
// Если встроиться под значки не удалось, программа просто закрывается: остаются неподвижные обои.
using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;

static class Native
{
    [DllImport("user32.dll", SetLastError = true)] public static extern IntPtr FindWindow(string cls, string name);
    [DllImport("user32.dll", SetLastError = true)] public static extern IntPtr FindWindowEx(IntPtr parent, IntPtr after, string cls, string name);
    [DllImport("user32.dll")] public static extern IntPtr SendMessageTimeout(IntPtr h, uint msg, IntPtr w, IntPtr l, uint flags, uint timeout, out IntPtr result);
    public delegate bool EnumProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
    [DllImport("user32.dll")] public static extern IntPtr SetParent(IntPtr child, IntPtr parent);
    [DllImport("user32.dll")] public static extern IntPtr GetParent(IntPtr h);
    [DllImport("user32.dll")] public static extern int GetWindowLong(IntPtr h, int idx);
    [DllImport("user32.dll")] public static extern int SetWindowLong(IntPtr h, int idx, int val);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int cx, int cy, uint flags);
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern int GetSystemMetrics(int i);
    public const int GWL_STYLE = -16, WS_CHILD = 0x40000000, WS_POPUP = unchecked((int)0x80000000), WS_VISIBLE = 0x10000000;
    public const uint SWP_NOACTIVATE = 0x10, SWP_SHOWWINDOW = 0x40;
}

class FaizWall
{
    static string Dir = AppDomain.CurrentDomain.BaseDirectory;

    [STAThread]
    static int Main(string[] args)
    {
        bool preview = Array.IndexOf(args, "--preview") >= 0;
        bool created;
        var single = new Mutex(true, "FAIZ_LiveWallpaper", out created);
        if (!created && !preview) return 0;               // already running
        Native.SetProcessDPIAware();
        Timeline.DesiredFrameRateProperty.OverrideMetadata(typeof(Timeline), new FrameworkPropertyMetadata { DefaultValue = 30 });

        var app = new Application { ShutdownMode = ShutdownMode.OnMainWindowClose };
        var win = BuildWindow(preview);
        int snap = Array.IndexOf(args, "--snapshot");          // --snapshot <file.png>: render after 3 s and exit (for checking)
        if (preview && snap >= 0 && snap + 1 < args.Length)
        {
            string file = args[snap + 1];
            var t = new System.Windows.Threading.DispatcherTimer { Interval = TimeSpan.FromSeconds(3) };
            t.Tick += (s, e) =>
            {
                t.Stop();
                var c = (FrameworkElement)win.Content;
                var rtb = new RenderTargetBitmap((int)c.ActualWidth, (int)c.ActualHeight, 96, 96, PixelFormats.Pbgra32);
                rtb.Render(c);
                var enc = new PngBitmapEncoder(); enc.Frames.Add(BitmapFrame.Create(rtb));
                using (var fs = File.Create(file)) enc.Save(fs);
                win.Close();
            };
            win.ContentRendered += (s, e) => t.Start();
        }
        if (!preview)
        {
            win.SourceInitialized += (s, e) =>
            {
                bool ok = Attach(new WindowInteropHelper(win).Handle);
                Log(ok ? "attached: " + Layout : "not attached (" + Layout + ") — static wallpaper stays");
                if (!ok) app.Shutdown(2);
            };
        }
        app.Run(win);
        GC.KeepAlive(single);
        return 0;
    }

    static string Layout = "";
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
    // one line per start in wall.log next to the program — to see on a shop PC how the wallpaper got attached
    static void Log(string msg)
    {
        try { File.AppendAllText(Path.Combine(Dir, "wall.log"), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "  " + msg + Environment.NewLine); } catch { }
    }

    static BitmapImage Img(string name, int px)
    {
        var b = new BitmapImage();
        b.BeginInit();
        b.UriSource = new Uri(Path.Combine(Dir, name));
        b.CacheOption = BitmapCacheOption.OnLoad;
        if (px > 0) b.DecodePixelWidth = px;            // decode at display size: less memory, less work
        b.EndInit(); b.Freeze();
        return b;
    }

    static Window BuildWindow(bool preview)
    {
        string brand = File.Exists(Path.Combine(Dir, "brand.txt")) ? File.ReadAllText(Path.Combine(Dir, "brand.txt")).Trim() : "vape";
        double sw = Native.GetSystemMetrics(0), sh = Native.GetSystemMetrics(1);   // primary screen, pixels
        var win = new Window
        {
            Title = brand == "bakery" ? "ФАЙЗ · пекарня — живые обои" : "ФАЙЗ · вейп-шоп — живые обои",
            WindowStyle = preview ? WindowStyle.SingleBorderWindow : WindowStyle.None,
            ResizeMode = preview ? ResizeMode.CanResize : ResizeMode.NoResize,
            ShowInTaskbar = preview, ShowActivated = preview,
            Width = preview ? 1280 : sw, Height = preview ? 720 : sh,
            Left = 0, Top = 0, Background = Brushes.Black,
            WindowStartupLocation = preview ? WindowStartupLocation.CenterScreen : WindowStartupLocation.Manual
        };
        var root = new Grid();
        root.Children.Add(new Image { Source = Img("bg.png", (int)Math.Min(1920, sw)), Stretch = Stretch.UniformToFill });
        int sealPx = (int)(Math.Min(sw, sh) * 0.80);
        var seal = new Grid { HorizontalAlignment = HorizontalAlignment.Center, VerticalAlignment = VerticalAlignment.Center };
        // seal size follows the window: 80 % of its shorter side
        root.SizeChanged += (s, e) => { double d = Math.Min(e.NewSize.Width, e.NewSize.Height) * 0.80; seal.Width = d; seal.Height = d; };
        seal.Children.Add(Ring("ring_outer.png", sealPx, 170, +1));
        seal.Children.Add(Ring("ring_main.png", sealPx, 60, +1));
        seal.Children.Add(Ring("ring_inner.png", sealPx, 85, -1));
        var core = new Image { Source = Img("core.png", sealPx), Stretch = Stretch.Uniform, RenderTransformOrigin = new Point(.5, .5) };
        if (brand == "bakery")
        {   // the bakery Ф breathes like rising dough
            var sc = new ScaleTransform(1, 1); core.RenderTransform = sc;
            var br = new DoubleAnimation(1, 1.03, TimeSpan.FromSeconds(2.3)) { AutoReverse = true, RepeatBehavior = RepeatBehavior.Forever, EasingFunction = new SineEase { EasingMode = EasingMode.EaseInOut } };
            sc.BeginAnimation(ScaleTransform.ScaleXProperty, br); sc.BeginAnimation(ScaleTransform.ScaleYProperty, br);
        }
        seal.Children.Add(core);
        root.Children.Add(seal);
        win.Content = root;
        return win;
    }

    static Image Ring(string file, int px, double seconds, int dir)
    {
        var img = new Image { Source = Img(file, px), Stretch = Stretch.Uniform, RenderTransformOrigin = new Point(.5, .5) };
        var rot = new RotateTransform(0); img.RenderTransform = rot;
        rot.BeginAnimation(RotateTransform.AngleProperty, new DoubleAnimation(0, 360 * dir, TimeSpan.FromSeconds(seconds)) { RepeatBehavior = RepeatBehavior.Forever });
        return img;
    }

    // Put the window between the desktop icons and the wallpaper. Two layouts exist:
    // Windows 11 24H2+ keeps the WorkerW inside Progman; older builds make it a separate top-level window.
    static bool Attach(IntPtr hwnd)
    {
        IntPtr progman = Native.FindWindow("Progman", null);
        if (progman == IntPtr.Zero) return false;
        IntPtr r;
        Native.SendMessageTimeout(progman, 0x052C, new IntPtr(0xD), new IntPtr(1), 0, 1000, out r);
        Native.SendMessageTimeout(progman, 0x052C, IntPtr.Zero, IntPtr.Zero, 0, 1000, out r);
        int w = Native.GetSystemMetrics(0), h = Native.GetSystemMetrics(1);
        int vx = Native.GetSystemMetrics(76), vy = Native.GetSystemMetrics(77);   // virtual-screen origin (monitors left/above primary)

        int style = Native.GetWindowLong(hwnd, Native.GWL_STYLE);
        Native.SetWindowLong(hwnd, Native.GWL_STYLE, (style & ~Native.WS_POPUP) | Native.WS_CHILD | Native.WS_VISIBLE);

        IntPtr defView = Native.FindWindowEx(progman, IntPtr.Zero, "SHELLDLL_DefView", null);
        IntPtr innerWorker = Native.FindWindowEx(progman, IntPtr.Zero, "WorkerW", null);
        if (defView != IntPtr.Zero && innerWorker != IntPtr.Zero)
        {   // new layout: child of Progman, just under the icons layer
            Layout = "Windows 11 24H2+ (Progman)";
            Native.SetParent(hwnd, progman);
            Native.SetWindowPos(hwnd, defView, -vx, -vy, w, h, Native.SWP_NOACTIVATE | Native.SWP_SHOWWINDOW);
            return Native.GetParent(hwnd) == progman;
        }
        // classic layout: the WorkerW that follows the window hosting SHELLDLL_DefView
        IntPtr worker = IntPtr.Zero;
        Native.EnumWindows((top, l) =>
        {
            if (Native.FindWindowEx(top, IntPtr.Zero, "SHELLDLL_DefView", null) != IntPtr.Zero)
                worker = Native.FindWindowEx(IntPtr.Zero, top, "WorkerW", null);
            return true;
        }, IntPtr.Zero);
        if (worker == IntPtr.Zero) { Layout = "no WorkerW found"; return false; }
        // another live-wallpaper program (or a desktop shell) keeps this layer hidden: our window would be invisible
        if (!IsWindowVisible(worker)) { Layout = "WorkerW hidden by another wallpaper program"; return false; }
        Layout = "classic WorkerW";
        Native.SetParent(hwnd, worker);
        Native.SetWindowPos(hwnd, IntPtr.Zero, -vx, -vy, w, h, Native.SWP_NOACTIVATE | Native.SWP_SHOWWINDOW);
        return Native.GetParent(hwnd) == worker;
    }
}
