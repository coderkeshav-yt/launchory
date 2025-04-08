
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, Eye, MessageSquare, CheckCircle, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

const AdminDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      console.log("Fetched messages:", data);
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      
      // Update the local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
      
      // If viewing this message, update the selected message too
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
      
      toast.success("Message marked as read");
    } catch (error: any) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to update message status");
    }
  }

  function viewMessage(message: Message) {
    setSelectedMessage(message);
    setIsMessageDialogOpen(true);
    
    // If message is not read, mark it as read
    if (!message.is_read) {
      markAsRead(message.id);
    }
  }

  const filteredMessages = messages.filter(msg => {
    const search = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(search) ||
      msg.email.toLowerCase().includes(search) ||
      msg.message.toLowerCase().includes(search)
    );
  });

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">View and manage contact form submissions.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshData} 
            disabled={refreshing || loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Read Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length - unreadCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contact Messages</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No messages found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead>
                      <TableHead>Message Preview</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className={!message.is_read ? "bg-muted/30" : ""}>
                        <TableCell>
                          <div className="font-medium">
                            {message.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {message.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[200px]">
                            {message.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {message.is_read ? (
                            <Badge variant="outline" className="bg-muted">Read</Badge>
                          ) : (
                            <Badge>New</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewMessage(message)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {!message.is_read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(message.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Read
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{selectedMessage.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-muted-foreground">Received</p>
                  <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Message</p>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </ScrollArea>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <div className="flex items-center">
              <Badge variant={selectedMessage?.is_read ? "outline" : "default"}>
                {selectedMessage?.is_read ? "Read" : "New"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  if (selectedMessage) {
                    // Create a mailto link
                    window.open(`mailto:${selectedMessage.email}?subject=Re: Your Message&body=Hi ${selectedMessage.name},\n\n`, '_blank');
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Reply via Email
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
