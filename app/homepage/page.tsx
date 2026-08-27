"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit, Loader2, Image, Link as LinkIcon } from "lucide-react"

interface SidebarItem {
  id: number
  image_url: string
  title: string
  caption: string
  order: number
  active: boolean
}

interface Slide {
  id: number
  image_url: string
  caption: string
  order: number
  active: boolean
}

interface Ad {
  id: number
  image_url: string
  title: string
  caption: string
  link: string
  order: number
  active: boolean
}

export default function HomepagePage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Sidebar items
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([])
  const [sidebarDialogOpen, setSidebarDialogOpen] = useState(false)
  const [editingSidebar, setEditingSidebar] = useState<SidebarItem | null>(null)
  const [sidebarForm, setSidebarForm] = useState({
    image_url: "",
    title: "",
    caption: "",
    order: 0,
    active: true,
  })
  
  // Slides
  const [slides, setSlides] = useState<Slide[]>([])
  const [slideDialogOpen, setSlideDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [slideForm, setSlideForm] = useState({
    image_url: "",
    caption: "",
    order: 0,
    active: true,
  })
  
  // Ads
  const [ads, setAds] = useState<Ad[]>([])
  const [adDialogOpen, setAdDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [adForm, setAdForm] = useState({
    image_url: "",
    title: "",
    caption: "",
    link: "",
    order: 0,
    active: true,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // Only superadmin can access
    if (role !== "Superadmin") {
      router.push("/dashboard")
      return
    }
    
    setToken(storedToken)
    fetchAllData(storedToken)
  }, [router])

  const fetchAllData = async (authToken: string) => {
    try {
      await Promise.all([
        fetchSidebarItems(authToken),
        fetchSlides(authToken),
        fetchAds(authToken),
      ])
    } catch (err) {
      setError("Failed to load homepage data")
    } finally {
      setLoading(false)
    }
  }

  const fetchSidebarItems = async (authToken: string) => {
    const response = await fetch("/api/v1/homepage/sidebar?active_only=false", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (response.ok) {
      const data = await response.json()
      setSidebarItems(data)
    }
  }

  const fetchSlides = async (authToken: string) => {
    const response = await fetch("/api/v1/homepage/slides?active_only=false", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (response.ok) {
      const data = await response.json()
      setSlides(data)
    }
  }

  const fetchAds = async (authToken: string) => {
    const response = await fetch("/api/v1/homepage/ads?active_only=false", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (response.ok) {
      const data = await response.json()
      setAds(data)
    }
  }

  const handleCreateSidebar = async () => {
    const response = await fetch("/api/v1/homepage/sidebar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sidebarForm),
    })
    if (response.ok) {
      setSidebarDialogOpen(false)
      setSidebarForm({ image_url: "", title: "", caption: "", order: 0, active: true })
      fetchSidebarItems(token)
    } else {
      setError("Failed to create sidebar item")
    }
  }

  const handleDeleteSidebar = async (id: number) => {
    if (!confirm("Are you sure?")) return
    const response = await fetch(`/api/v1/homepage/sidebar/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.ok) {
      fetchSidebarItems(token)
    }
  }

  const handleCreateSlide = async () => {
    const response = await fetch("/api/v1/homepage/slides", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slideForm),
    })
    if (response.ok) {
      setSlideDialogOpen(false)
      setSlideForm({ image_url: "", caption: "", order: 0, active: true })
      fetchSlides(token)
    }
  }

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("Are you sure?")) return
    const response = await fetch(`/api/v1/homepage/slides/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.ok) {
      fetchSlides(token)
    }
  }

  const handleCreateAd = async () => {
    const response = await fetch("/api/v1/homepage/ads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adForm),
    })
    if (response.ok) {
      setAdDialogOpen(false)
      setAdForm({ image_url: "", title: "", caption: "", link: "", order: 0, active: true })
      fetchAds(token)
    }
  }

  const handleDeleteAd = async (id: number) => {
    if (!confirm("Are you sure?")) return
    const response = await fetch(`/api/v1/homepage/ads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.ok) {
      fetchAds(token)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Management</h1>
          <p className="text-gray-500 mt-1">
            Manage sidebar items, slides, and ads on the homepage
          </p>
        </div>

        <Tabs defaultValue="sidebar" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sidebar">Sidebar Items</TabsTrigger>
            <TabsTrigger value="slides">Slides</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
          </TabsList>

          {/* Sidebar Items Tab */}
          <TabsContent value="sidebar" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sidebar Items</CardTitle>
                <Dialog open={sidebarDialogOpen} onOpenChange={setSidebarDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Sidebar Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Sidebar Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to the homepage sidebar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={sidebarForm.image_url}
                          onChange={(e) => setSidebarForm({ ...sidebarForm, image_url: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Item title"
                          value={sidebarForm.title}
                          onChange={(e) => setSidebarForm({ ...sidebarForm, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Caption</Label>
                        <Textarea
                          placeholder="Item description"
                          value={sidebarForm.caption}
                          onChange={(e) => setSidebarForm({ ...sidebarForm, caption: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order (lower = higher)</Label>
                        <Input
                          type="number"
                          value={sidebarForm.order}
                          onChange={(e) => setSidebarForm({ ...sidebarForm, order: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateSidebar}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {sidebarItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No sidebar items</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sidebarItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.order}</TableCell>
                            <TableCell>
                              <img src={item.image_url} alt={item.title} className="h-10 w-10 object-cover rounded" />
                            </TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${item.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {item.active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteSidebar(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slides Tab */}
          <TabsContent value="slides" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Homepage Slides</CardTitle>
                <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Slide
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Slide</DialogTitle>
                      <DialogDescription>
                        Add a new slide to the homepage carousel.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          placeholder="https://example.com/slide.jpg"
                          value={slideForm.image_url}
                          onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Caption</Label>
                        <Input
                          placeholder="Slide caption"
                          value={slideForm.caption}
                          onChange={(e) => setSlideForm({ ...slideForm, caption: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order (lower = first)</Label>
                        <Input
                          type="number"
                          value={slideForm.order}
                          onChange={(e) => setSlideForm({ ...slideForm, order: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateSlide}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {slides.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No slides</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Caption</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {slides.map((slide) => (
                          <TableRow key={slide.id}>
                            <TableCell>{slide.order}</TableCell>
                            <TableCell>
                              <img src={slide.image_url} alt={slide.caption} className="h-10 w-16 object-cover rounded" />
                            </TableCell>
                            <TableCell>{slide.caption}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${slide.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {slide.active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteSlide(slide.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Homepage Ads</CardTitle>
                <Dialog open={adDialogOpen} onOpenChange={setAdDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Ad
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Ad</DialogTitle>
                      <DialogDescription>
                        Add a new advertisement to the homepage.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          placeholder="https://example.com/ad.jpg"
                          value={adForm.image_url}
                          onChange={(e) => setAdForm({ ...adForm, image_url: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Ad title"
                          value={adForm.title}
                          onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Caption</Label>
                        <Textarea
                          placeholder="Ad description"
                          value={adForm.caption}
                          onChange={(e) => setAdForm({ ...adForm, caption: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link URL</Label>
                        <Input
                          placeholder="https://example.com"
                          value={adForm.link}
                          onChange={(e) => setAdForm({ ...adForm, link: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={adForm.order}
                          onChange={(e) => setAdForm({ ...adForm, order: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateAd}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {ads.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No ads</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Link</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ads.map((ad) => (
                          <TableRow key={ad.id}>
                            <TableCell>{ad.order}</TableCell>
                            <TableCell>
                              <img src={ad.image_url} alt={ad.title} className="h-10 w-10 object-cover rounded" />
                            </TableCell>
                            <TableCell>{ad.title}</TableCell>
                            <TableCell>
                              <a href={ad.link} target="_blank" className="text-blue-600 hover:underline">{ad.link}</a>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${ad.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {ad.active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}